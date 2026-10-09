import { useEffect, useState } from "react";

import { searchLinkOptions,type LinkOption } from "../../api/workpulseApi";
import type { ChangeEvent } from "react";
import type { FormField } from "../../types/form";

interface DynamicFieldProps {
  field: FormField;
  value: unknown;
  onChange: (fieldname: string, value: unknown) => void;
  referenceDoctype? : string;
}


function DynamicField({
  field,
  value,
  onChange,
  referenceDoctype
}: DynamicFieldProps) {


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


  const [linkQuery, setLinkQuery] = useState(String(value ?? ""));
  const [linkOptions, setLinkOptions] = useState<LinkOption[]>([]);
  const [showLinkOptions, setShowLinkOptions] = useState(false);
  const [isSearchingLinks, setIsSearchingLinks] = useState(false);

  const linkDoctype =
    field.fieldtype === "Link" && typeof field.options === "string"
      ? field.options.trim()
      : "";

  useEffect(() => {
    setLinkQuery(String(value ?? ""));
  }, [value]);

  useEffect(() => {
    let cancelled = false;

    if (
      field.fieldtype !== "Link" ||
      !linkDoctype ||
      !referenceDoctype ||
      !showLinkOptions ||
      !linkQuery.trim()
    ) {
      setLinkOptions([]);
      setIsSearchingLinks(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearchingLinks(true);

      try {
        const results = await searchLinkOptions(
          linkDoctype,
          linkQuery.trim(),
          referenceDoctype,
        );

        if (!cancelled) {
          setLinkOptions(results);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to search Link records:", error);
          setLinkOptions([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearchingLinks(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [
    field.fieldtype,
    linkDoctype,
    referenceDoctype,
    linkQuery,
    showLinkOptions,
  ]);

    if (field.hidden) {
    return null;
  }


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
      return (
        <FieldWrapper field={field}>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              {...commonProps}
              type="text"
              autoComplete="off"
              value={linkQuery}
              placeholder={
                field.options
                  ? `Search ${field.options}`
                  : `Search ${field.label}`
              }
              onChange={(event) => {
                setLinkQuery(event.target.value);
                setShowLinkOptions(true);
              }}
              onFocus={() => setShowLinkOptions(true)}
              onBlur={() => {
                window.setTimeout(() => setShowLinkOptions(false), 150);
              }}
            />

            {showLinkOptions &&
              linkDoctype &&
              referenceDoctype &&
              linkQuery.trim() !== "" && (
                <div
                  role="listbox"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: "220px",
                    overflowY: "auto",
                    background: "var(--card-bg, white)",
                    border: "1px solid var(--border-color, #ddd)",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  {isSearchingLinks ? (
                    <div style={{ padding: "10px 12px" }}>
                      Searching...
                    </div>
                  ) : linkOptions.length > 0 ? (
                    linkOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={String(value ?? "") === option.value}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setLinkQuery(option.value);
                          setShowLinkOptions(false);
                          setLinkOptions([]);

                          // Commit only an explicitly selected record.
                          onChange(field.fieldname, option.value);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 12px",
                          border: "none",
                          borderBottom: "1px solid var(--border-color, #eee)",
                          background: "transparent",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        <div>{option.value}</div>

                        {option.description && (
                          <div
                            style={{
                              fontSize: "12px",
                              opacity: 0.7,
                              marginTop: "3px",
                            }}
                          >
                            {option.description}
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: "10px 12px" }}>
                      No matching records found.
                    </div>
                  )}
                </div>
              )}
          </div>
        </FieldWrapper>
      );

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