import { useState } from "react";
import type { DynamicFormConfig, FormField } from "../../types/form";
import { getLinkedFieldValues } from "../../api/workpulseApi";
import DynamicField from "./DynamicField";

interface DynamicFormProps {
  config: DynamicFormConfig;
  configuration?: string;
  sectionId?: string;
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => void;
}

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === "";
}

function DynamicForm({
  config,
  configuration,
  sectionId,
  initialValues = {},
  onSubmit,
}: DynamicFormProps) {
  const [values, setValues] =
    useState<Record<string, unknown>>(initialValues);

  const handleChange = (fieldname: string, value: unknown) => {
    setValues((previous) => ({
      ...previous,
      [fieldname]: value,
    }));

    const changedField = config.fields.find(
      (field: FormField) => field.fieldname === fieldname,
    );

    // Fetch linked values only when a Link record is selected.
    if (
      changedField?.fieldtype !== "Link" ||
      typeof value !== "string" ||
      !value.trim() ||
      !configuration ||
      !sectionId
    ) {
      return;
    }

    void getLinkedFieldValues(
      configuration,
      sectionId,
      fieldname,
      value,
    )
      .then((response) => {
        setValues((previous) => {
          // Ignore responses for a Link selection that has since changed.
          if (previous[fieldname] !== value) {
            return previous;
          }

          const updated = { ...previous };

          for (const [targetFieldname, fetchedValue] of Object.entries(
            response.values,
          )) {
            const targetField = config.fields.find(
              (field: FormField) =>
                field.fieldname === targetFieldname,
            );

            if (!targetField) {
              continue;
            }

            const fetchIfEmpty =
              targetField.fetch_if_empty === true ||
              targetField.fetch_if_empty === 1;

            if (
              fetchIfEmpty &&
              !isEmptyValue(previous[targetFieldname])
            ) {
              continue;
            }

            updated[targetFieldname] = fetchedValue;
          }

          return updated;
        });
      })
      .catch((error: unknown) => {
        console.error(
          `Unable to fetch linked values for "${fieldname}":`,
          error,
        );
      });
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit}>
      {config.fields.map((field: FormField) => (
        <DynamicField
          key={field.fieldname}
          field={field}
          value={values[field.fieldname]}
          onChange={handleChange}
          referenceDoctype={config.doctype}
        />
      ))}

      <div className="form-actions">
        <button type="submit" className="form-submit-button">
          Save
        </button>
      </div>
    </form>
  );
}

export default DynamicForm;