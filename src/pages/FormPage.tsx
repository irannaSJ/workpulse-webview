import { useMemo } from "react";

import "./FormPage.css"
import DynamicForm from "../components/form/DynamicForm";

import type { DynamicFormConfig } from "../types/form";
import type { WorkpulseSection } from "../types/uiDefinition";

import "./FormPage.css";

interface FormPageProps {
  section: WorkpulseSection;
  onBack: () => void;
}

function FormPage({
  section,
  onBack,
}: FormPageProps) {
  const formConfig = useMemo<DynamicFormConfig>(() => {
    const fields = section.fields
      .filter((field) => field.enabled && field.readAccess)
      .sort(
        (a, b) =>
          (a.order ?? a.idx ?? 0) -
          (b.order ?? b.idx ?? 0)
      )
      .map((field) => ({
        label: field.label ?? field.fieldname,
        fieldname: field.fieldname,
        fieldtype: field.fieldtype as DynamicFormConfig["fields"][number]["fieldtype"],
        options: field.options,
        default: field.default,
        reqd: field.reqd ? 1 : 0,
        read_only: field.readOnly ? 1 : 0,
        hidden: 0,
        description: field.description ?? undefined,

        fetch_from : field.fetchFrom,
        fetch_if_empty : field.fetchIfEmpty
      }));

    return {
      doctype: section.sourceDoctype,
      fields,
    };
  }, [section]);

  const handleSubmit = (values: Record<string, unknown>) => {
    console.log("Form values:", values);
  };

  return (
    <main className="form-page">
      <header className="form-page__header">
        <button
          type="button"
          className="form-page__back"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="form-page__heading">
          <span className="form-page__eyebrow">
            FORM
          </span>

          <h1 className="form-page__title">
            {section.sourceDoctype}
          </h1>

          <p className="form-page__subtitle">
            Create a new {section.sourceDoctype} record.
          </p>
        </div>
      </header>

      <section className="form-page__content">
        <div className="form-page__card">
          <div className="form-page__card-header">
            <div>
              <h2>
                {section.sourceDoctype}
              </h2>

              <p>
                Enter the required information below.
              </p>
            </div>
          </div>

          <DynamicForm
            config={formConfig}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </main>
  );
}

export default FormPage;