import {  useState } from "react";

import type {
  DynamicFormConfig,
  FormField,
} from "../../types/form";

import DynamicField from "./DynamicField";

interface DynamicFormProps {
  config: DynamicFormConfig;
  initialValues?: Record<string, unknown>;
  onSubmit?: (values: Record<string, unknown>) => void;
}

function DynamicForm({
  config,
  initialValues = {},
  onSubmit,
}: DynamicFormProps) {
  const [values, setValues] =
    useState<Record<string, unknown>>(initialValues);


  const handleChange = (
    fieldname: string,
    value: unknown
  ) => {
    setValues((previous) => ({
      ...previous,
      [fieldname]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSubmit?.(values);
  };

  return (
    <form
      className="dynamic-form"
      onSubmit={handleSubmit}
    >
      {config.fields.map((field: FormField) => (
        <DynamicField
          key={field.fieldname}
          field={field}
          value={values[field.fieldname]}
          onChange={handleChange}
        />
      ))}

      <div className="form-actions">
        <button
          type="submit"
          className="form-submit-button"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default DynamicForm;