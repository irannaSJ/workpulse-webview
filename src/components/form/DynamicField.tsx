import type { ChangeEvent } from "react";
import type { FormField } from "../../types/form";

interface DynamicFieldProps {
  field: FormField;
  value: unknown;
  onChange: (fieldname: string, value: unknown) => void;
}

function DynamicField({
  field,
  value,
  onChange,
}: DynamicFieldProps) {
  if (field.hidden) {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let newValue: unknown = event.target.value;

    if (field.fieldtype === "Check") {
      newValue = (event.target as HTMLInputElement).checked ? 1 : 0;
    }

    if (
      field.fieldtype === "Int" ||
      field.fieldtype === "Float" ||
      field.fieldtype === "Currency" ||
      field.fieldtype === "Percent"
    ) {
      newValue =
        event.target.value === ""
          ? ""
          : Number(event.target.value);
    }

    onChange(field.fieldname, newValue);
  };

  const commonProps = {
    id: field.fieldname,
    name: field.fieldname,
    disabled: !!field.read_only,
    required: !!field.reqd,
    placeholder: field.placeholder,
  };

  switch (field.fieldtype) {
    case "Data":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="text"
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Password":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="password"
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    // case "Email":
    //   return (
    //     <FieldWrapper field={field}>
    //       <input
    //         {...commonProps}
    //         type="email"
    //         value={(value as string) ?? ""}
    //         onChange={handleChange}
    //       />
    //     </FieldWrapper>
    //   );

    case "Int":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="number"
            step="1"
            value={(value as number | string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Float":
    case "Currency":
    case "Percent":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="number"
            step="any"
            value={(value as number | string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Date":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="date"
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Datetime":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="datetime-local"
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Time":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="time"
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Check":
      return (
        <FieldWrapper field={field}>
          <label className="form-checkbox">
            <input
              {...commonProps}
              type="checkbox"
              checked={Boolean(value)}
              onChange={handleChange}
            />

            <span>{field.label}</span>
          </label>
        </FieldWrapper>
      );

    case "Select":
      return (
        <FieldWrapper field={field}>
          <select
            {...commonProps}
            value={(value as string) ?? ""}
            onChange={handleChange}
          >
            <option value="">Select {field.label}</option>

            {(Array.isArray(field.options)
              ? field.options
              : field.options?.split("\n") ?? []
            ).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FieldWrapper>
      );

    case "Small Text":
    case "Long Text":
    case "Text":
      return (
        <FieldWrapper field={field}>
          <textarea
            {...commonProps}
            rows={5}
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Text Editor":
    case "Markdown Editor":
    case "Code":
      return (
        <FieldWrapper field={field}>
          <textarea
            {...commonProps}
            rows={8}
            value={(value as string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Color":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="color"
            value={(value as string) || "#000000"}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Rating":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={(value as number | string) ?? ""}
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "JSON":
      return (
        <FieldWrapper field={field}>
          <textarea
            {...commonProps}
            rows={8}
            value={
              typeof value === "string"
                ? value
                : JSON.stringify(value ?? {}, null, 2)
            }
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Read Only":
      return (
        <FieldWrapper field={field}>
          <div className="form-readonly">
            {String(value ?? "")}
          </div>
        </FieldWrapper>
      );

    case "HTML":
      return (
        <FieldWrapper field={field}>
          <div
            className="form-html"
            dangerouslySetInnerHTML={{
              __html: String(field.options ?? ""),
            }}
          />
        </FieldWrapper>
      );

    case "Section Break":
      return (
        <div className="form-section-break">
          <h3>{field.label}</h3>
        </div>
      );

    case "Column Break":
      return <div className="form-column-break" />;

    case "Tab Break":
      return (
        <div className="form-tab-break">
          <h3>{field.label}</h3>
        </div>
      );

    case "Button":
      return (
        <button
          type="button"
          className="form-action-button"
          onClick={() => onChange(field.fieldname, true)}
        >
          {field.label}
        </button>
      );

    case "Link":
    case "Dynamic Link":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="text"
            value={(value as string) ?? ""}
            placeholder={
              field.options
                ? `Search ${field.options}`
                : `Search ${field.label}`
            }
            onChange={handleChange}
          />
        </FieldWrapper>
      );

    case "Attach":
    case "Attach Image":
      return (
        <FieldWrapper field={field}>
          <input
            {...commonProps}
            type="file"
            accept={
              field.fieldtype === "Attach Image"
                ? "image/*"
                : undefined
            }
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;

              onChange(field.fieldname, file);
            }}
          />
        </FieldWrapper>
      );

    case "Image":
      return (
        <FieldWrapper field={field}>
          {value ? (
            <img
              src={String(value)}
              alt={field.label}
              className="form-image-preview"
            />
          ) : (
            <div className="form-image-placeholder">
              No image
            </div>
          )}
        </FieldWrapper>
      );

    default:
      return (
        <FieldWrapper field={field}>
          <div className="form-unsupported">
            Unsupported field type: {field.fieldtype}
          </div>
        </FieldWrapper>
      );
  }
}

interface FieldWrapperProps {
  field: FormField;
  children: React.ReactNode;
}

function FieldWrapper({
  field,
  children,
}: FieldWrapperProps) {
  return (
    <div className="form-field">
      {field.fieldtype !== "Check" && (
        <label htmlFor={field.fieldname}>
          {field.label}

          {field.reqd ? (
            <span className="required-mark"> *</span>
          ) : null}
        </label>
      )}

      {children}

      {field.description ? (
        <small>{field.description}</small>
      ) : null}
    </div>
  );
}

export default DynamicField;