import { useMemo, useState } from "react";

import "./FormPage.css"
import DynamicForm from "../components/form/DynamicForm";

import type { DynamicFormConfig } from "../types/form";
import type { WorkpulseSection } from "../types/uiDefinition";
import { saveSourceDoctypeUiRecord } from "../api/workpulseApi";

import "./FormPage.css";

interface FormPageProps {
  section: WorkpulseSection;
  configuration : string;
  onBack: () => void;
}

function FormPage({
  section,
  configuration,
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

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (
    values: Record<string, unknown>,
  ) => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const response = await saveSourceDoctypeUiRecord(
        configuration,
        section.id,
        values,
      );

      setSaveMessage(
        `${response.message} Record ID: ${response.name}`,
      );
    } catch (error: unknown) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Unable to save the record. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
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
            configuration={configuration}
            sectionId={section.id}
            onSubmit={handleSubmit}
          />

          {isSaving && (
            <p role="status">
              Saving record to ERPNext...
            </p>
          )}

          {saveMessage && (
            <p role="status">
              {saveMessage}
            </p>
          )}

          {saveError && (
            <p role="alert">
              Save failed: {saveError}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default FormPage;