import { useMemo, useState } from "react";

import type {
  DynamicTableConfig,
} from "../../types/table";

import "./DynamicTable.css";

interface DynamicTableProps {
  config: DynamicTableConfig;
  loading?: boolean;
  error?: string | null;

  onRowClick?: (
    row: Record<string, unknown>,
  ) => void;

  onAction?: (
    action: string,
    row: Record<string, unknown>,
  ) => void;
}

function DynamicTable({
  config,
  loading = false,
  error = null,
  onRowClick,
  onAction,
}: DynamicTableProps) {
  const [searchQuery, setSearchQuery] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(config.pageSize ?? 10);

  const visibleColumns =
    config.columns.filter(
      (column) => !column.hidden,
    );

  const searchableColumns =
    config.columns.filter(
      (column) =>
        !column.hidden &&
        column.searchable !== false,
    );

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) {
      return config.rows;
    }

    const query =
      searchQuery.trim().toLowerCase();

    return config.rows.filter((row) =>
      searchableColumns.some((column) => {
        const value =
          row[column.fieldname];

        if (
          value === null ||
          value === undefined
        ) {
          return false;
        }

        return String(value)
          .toLowerCase()
          .includes(query);
      }),
    );
  }, [
    config.rows,
    searchableColumns,
    searchQuery,
  ]);

  const paginationEnabled =
    config.pagination !== false;

  const totalRows =
    filteredRows.length;

  const totalPages =
    paginationEnabled
      ? Math.max(
          1,
          Math.ceil(
            totalRows / pageSize,
          ),
        )
      : 1;

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages,
    );

  const startIndex =
    paginationEnabled
      ? (safeCurrentPage - 1) *
        pageSize
      : 0;

  const endIndex =
    paginationEnabled
      ? startIndex + pageSize
      : filteredRows.length;

  const displayedRows =
    filteredRows.slice(
      startIndex,
      endIndex,
    );

  const handleSearch = (
    value: string,
  ) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (
    value: number,
  ) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const formatValue = (
    value: unknown,
    fieldtype: string,
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    switch (fieldtype) {
      case "Check":
        return value ? "Yes" : "No";

      case "Currency":
        return `₹ ${Number(value).toLocaleString(
          "en-IN",
        )}`;

      case "Percent":
        return `${value}%`;

      default:
        return String(value);
    }
  };

  if (loading) {
    return (
      <div className="dynamic-table-container">
        <div className="dynamic-table-state">
          <div className="table-spinner" />

          <p>
            Loading records...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dynamic-table-container">
        <div className="dynamic-table-state dynamic-table-state--error">
          <div className="table-error-icon">
            !
          </div>

          <h3>
            Something went wrong
          </h3>

          <p>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const showInternalHeader =
    Boolean(
      config.title ||
        config.doctype,
    );

  return (
    <div className="dynamic-table-container">

      {/* =================================================
          OPTIONAL HEADER
          ================================================= */}

      {showInternalHeader && (
        <div className="dynamic-table-header">

          <div className="dynamic-table-title">

            {config.title && (
              <h2>
                {config.title}
              </h2>
            )}

            {config.doctype && (
              <span>
                {config.doctype}
              </span>
            )}

          </div>

          <span className="table-count">
            {totalRows}{" "}
            {totalRows === 1
              ? "record"
              : "records"}
          </span>

        </div>
      )}


      {/* =================================================
          OPTIONAL INTERNAL SEARCH
          ================================================= */}

      {config.searchable !== false && (
        <div className="dynamic-table-toolbar">

          <div className="table-search">

            <span
              className="search-icon"
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              type="search"
              value={searchQuery}
              placeholder="Search records..."
              onChange={(event) =>
                handleSearch(
                  event.target.value,
                )
              }
            />

            {searchQuery && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                onClick={() =>
                  handleSearch("")
                }
              >
                ×
              </button>
            )}

          </div>

        </div>
      )}


      {/* =================================================
          TABLE
          ================================================= */}

      <div className="dynamic-table-scroll">

        <table className="dynamic-table">

          <thead>
            <tr>

              {visibleColumns.map(
                (
                  column,
                  index,
                ) => (
                  <th
                    key={
                      column.fieldname
                    }
                    className={
                      index === 0
                        ? "dynamic-table__sticky-column dynamic-table__first-column"
                        : ""
                    }
                    style={{
                      width:
                        column.width,
                      textAlign:
                        column.align ??
                        "left",
                    }}
                  >
                    {column.label}
                  </th>
                ),
              )}

              {config.actions &&
                config.actions.length >
                  0 && (
                  <th className="table-actions-header">
                    Actions
                  </th>
                )}

            </tr>
          </thead>


          <tbody>

            {displayedRows.length ===
            0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumns.length +
                    (config.actions?.length
                      ? 1
                      : 0)
                  }
                  className="table-empty"
                >
                  <div className="table-empty-content">

                    <div className="empty-icon">
                      —
                    </div>

                    <h3>
                      No records found
                    </h3>

                    <p>
                      {searchQuery
                        ? "Try changing your search."
                        : "There are no records to display."}
                    </p>

                  </div>
                </td>
              </tr>
            ) : (
              displayedRows.map(
                (
                  row,
                  rowIndex,
                ) => {

                  const rowKey =
                    String(
                      row.name ??
                        row.id ??
                        `${safeCurrentPage}-${rowIndex}`,
                    );

                  return (
                    <tr
                      key={rowKey}
                      onClick={() =>
                        onRowClick?.(
                          row,
                        )
                      }
                      className={
                        onRowClick
                          ? "table-row-clickable"
                          : ""
                      }
                    >

                      {visibleColumns.map(
                        (
                          column,
                          columnIndex,
                        ) => {

                          const value =
                            row[
                              column.fieldname
                            ];

                          return (
                            <td
                              key={
                                column.fieldname
                              }
                              className={
                                columnIndex ===
                                0
                                  ? "dynamic-table__sticky-column dynamic-table__first-column"
                                  : ""
                              }
                              style={{
                                textAlign:
                                  column.align ??
                                  "left",
                              }}
                            >
                              <TableCell
                                value={
                                  value
                                }
                                fieldtype={
                                  column.fieldtype
                                }
                                formatValue={
                                  formatValue
                                }
                              />
                            </td>
                          );
                        },
                      )}

                      {config.actions &&
                        config.actions.length >
                          0 && (
                          <td
                            className="table-actions"
                            onClick={(
                              event,
                            ) =>
                              event.stopPropagation()
                            }
                          >
                            {config.actions.map(
                              (
                                action,
                              ) => (
                                <button
                                  key={
                                    action.action
                                  }
                                  type="button"
                                  onClick={() =>
                                    onAction?.(
                                      action.action,
                                      row,
                                    )
                                  }
                                >
                                  {
                                    action.label
                                  }
                                </button>
                              ),
                            )}
                          </td>
                        )}

                    </tr>
                  );
                },
              )
            )}

          </tbody>

        </table>

      </div>


      {/* =================================================
          INTERNAL PAGINATION
          ================================================= */}

      {paginationEnabled &&
        totalRows > 0 && (
          <div className="dynamic-table-pagination">

            <div className="pagination-info">
              Showing{" "}
              <strong>
                {startIndex + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(
                  endIndex,
                  totalRows,
                )}
              </strong>{" "}
              of{" "}
              <strong>
                {totalRows}
              </strong>
            </div>

            <div className="pagination-controls">

              <div className="page-size">
                <span>
                  Rows
                </span>

                <select
                  value={pageSize}
                  onChange={(event) =>
                    handlePageSizeChange(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                >
                  {(
                    config.pageSizeOptions ??
                    [
                      5,
                      10,
                      20,
                      50,
                    ]
                  ).map(
                    (size) => (
                      <option
                        key={size}
                        value={size}
                      >
                        {size}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <button
                type="button"
                className="pagination-button"
                disabled={
                  safeCurrentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1,
                      ),
                  )
                }
              >
                ‹
              </button>

              <div className="pagination-pages">
                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1,
                )
                  .filter(
                    (page) =>
                      page === 1 ||
                      page ===
                        totalPages ||
                      Math.abs(
                        page -
                          safeCurrentPage,
                      ) <= 1,
                  )
                  .map(
                    (
                      page,
                      index,
                      pages,
                    ) => {

                      const previousPage =
                        pages[
                          index - 1
                        ];

                      const showDots =
                        previousPage &&
                        page -
                          previousPage >
                          1;

                      return (
                        <span
                          key={page}
                          className="pagination-page-wrapper"
                        >

                          {showDots && (
                            <span className="pagination-dots">
                              ...
                            </span>
                          )}

                          <button
                            type="button"
                            className={`pagination-page ${
                              safeCurrentPage ===
                              page
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              setCurrentPage(
                                page,
                              )
                            }
                          >
                            {page}
                          </button>

                        </span>
                      );
                    },
                  )}
              </div>

              <button
                type="button"
                className="pagination-button"
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1,
                      ),
                  )
                }
              >
                ›
              </button>

            </div>

          </div>
        )}

    </div>
  );
}


/* =========================================================
   TABLE CELL
   ========================================================= */

interface TableCellProps {
  value: unknown;
  fieldtype: string;

  formatValue: (
    value: unknown,
    fieldtype: string,
  ) => string;
}

function TableCell({
  value,
  fieldtype,
  formatValue,
}: TableCellProps) {
  if (fieldtype === "Status") {
    const status = String(
      value ?? "",
    );

    const statusClass = status
      .toLowerCase()
      .replace(
        /\s+/g,
        "-",
      );

    return (
      <span
        className={`table-status status-${statusClass}`}
      >
        {status}
      </span>
    );
  }

  if (fieldtype === "Image") {
    if (!value) {
      return (
        <div className="table-image-placeholder">
          —
        </div>
      );
    }

    return (
      <img
        src={String(value)}
        alt=""
        className="table-image"
      />
    );
  }

  return (
    <span>
      {formatValue(
        value,
        fieldtype,
      )}
    </span>
  );
}

export default DynamicTable;