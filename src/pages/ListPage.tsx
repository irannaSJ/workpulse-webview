import { useEffect, useMemo, useState } from "react";

import { getRecords } from "../api/workpulseApi";

import type {
  WorkpulseSection,
} from "../types/uiDefinition";

import DynamicTable from "../components/table/DynamicTable";

import type {
  DynamicTableConfig,
  TableColumn,
} from "../types/table";

import "./ListPage.css";

interface ListPageProps {
  configuration: string;
  section: WorkpulseSection;
  onBack: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

export function ListPage({
  configuration,
  section,
  onBack,
}: ListPageProps) {
  const [records, setRecords] = useState<
    Record<string, unknown>[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(DEFAULT_PAGE_SIZE);

  const [hasMore, setHasMore] =
    useState(false);

  const totalReturned =
    records.length;

  useEffect(() => {
    let mounted = true;

    async function loadRecords() {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getRecords(
            configuration,
            section.id,
            {
              limit: pageSize,
              start:
                (currentPage - 1) *
                pageSize,
              search,
            },
          );

        if (!mounted) {
          return;
        }

        setRecords(
          response.records,
        );

        setHasMore(
          response.pagination.hasMore,
        );
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load records.",
        );

        setRecords([]);
        setHasMore(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadRecords();

    return () => {
      mounted = false;
    };
  }, [
    configuration,
    section.id,
    currentPage,
    pageSize,
    search,
  ]);

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const columns = useMemo<TableColumn[]>(
    () =>
      section.fields
        .filter(
          (field) =>
            field.enabled,
        )
        .sort(
          (a, b) =>
            (a.order ?? 0) -
            (b.order ?? 0),
        )
        .map((field) => ({
          fieldname:
            field.fieldname,

          label:
            field.label ||
            field.fieldname,

          fieldtype:
            field.fieldtype ===
            "Check"
              ? "Check"
              : field.fieldtype ===
                  "Currency"
                ? "Currency"
                : field.fieldtype ===
                    "Percent"
                  ? "Percent"
                  : "Text",

          searchable: true,
          hidden: false,
        })),
    [section.fields],
  );

  const tableConfig =
    useMemo<DynamicTableConfig>(
      () => ({
        title: "",
        doctype: "",
        columns,
        rows: records,
        searchable: false,
        pagination: false,
        pageSize:
          records.length || 1,
        pageSizeOptions: [pageSize],
      }),
      [
        columns,
        records,
        pageSize,
      ],
    );

  const canGoPrevious =
    currentPage > 1;

  const canGoNext =
    hasMore;

  const handlePrevious = () => {
    if (!canGoPrevious) {
      return;
    }

    setCurrentPage(
      (page) =>
        Math.max(
          1,
          page - 1,
        ),
    );
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }

    setCurrentPage(
      (page) =>
        page + 1,
    );
  };

  return (
    <main className="list-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <header className="list-page__header">

        <button
          type="button"
          className="list-page__back"
          onClick={onBack}
          aria-label="Go back"
        >
          <span className="list-page__back-icon">
            ←
          </span>

          <span>
            Back
          </span>
        </button>

        <div className="list-page__heading">

          <span className="list-page__eyebrow">
            LIST
          </span>

          <h1 className="list-page__title">
            {section.sourceDoctype}
          </h1>

          <p className="list-page__subtitle">
            Browse and search records
            configured for WorkPulse.
          </p>

        </div>

      </header>


      {/* =================================================
          TOOLBAR
          ================================================= */}

      <section className="list-page__toolbar">

        <div className="list-page__search">

          <span
            className="list-page__search-icon"
            aria-hidden="true"
          >
            ⌕
          </span>

          <input
            type="search"
            value={search}
            placeholder={`Search ${section.sourceDoctype}...`}
            aria-label={`Search ${section.sourceDoctype}`}
            onChange={(event) =>
              handleSearchChange(
                event.target.value,
              )
            }
          />

          {search && (
            <button
              type="button"
              className="list-page__search-clear"
              aria-label="Clear search"
              onClick={() =>
                handleSearchChange("")
              }
            >
              ×
            </button>
          )}

        </div>


        <div className="list-page__rows">

  <span className="list-page__rows-label">
    Rows per page
  </span>

  <div className="list-page__rows-select">

    <select
      value={pageSize}
      aria-label="Rows per page"
      onChange={(event) => {
        setPageSize(
          Number(event.target.value),
        );

        setCurrentPage(1);
      }}
    >
      <option value={5}>
        5
      </option>

      <option value={10}>
        10
      </option>

      <option value={20}>
        20
      </option>

      <option value={50}>
        50
      </option>
    </select>

    <span
      className="list-page__rows-select-arrow"
      aria-hidden="true"
    >
      ▼
    </span>

  </div>

</div>

      </section>


      {/* =================================================
          TABLE HEADER
          ================================================= */}

      <div className="list-page__table-meta">

        <div>
          <span className="list-page__table-meta-title">
            {section.sourceDoctype}
          </span>

          <span className="list-page__table-meta-text">
            {totalReturned}{" "}
            {totalReturned === 1
              ? "record"
              : "records"}{" "}
            on this page
          </span>
        </div>

        <span className="list-page__table-meta-page">
          Page {currentPage}
        </span>

      </div>


      {/* =================================================
          TABLE
          ================================================= */}

      <section
        className="list-page__table"
        aria-label={`${section.sourceDoctype} records`}
      >
        <DynamicTable
          config={tableConfig}
          loading={loading}
          error={error}
        />
      </section>


      {/* =================================================
          PAGINATION
          ================================================= */}

      <footer className="list-page__pagination">

        <div className="list-page__page-info">

          <span>
            Page
          </span>

          <strong>
            {currentPage}
          </strong>

        </div>


        <div className="list-page__page-actions">

          <button
            type="button"
            className="list-page__page-button"
            disabled={!canGoPrevious}
            onClick={handlePrevious}
          >
            <span>←</span>
            Previous
          </button>

          <button
            type="button"
            className="list-page__page-button list-page__page-button--primary"
            disabled={!canGoNext}
            onClick={handleNext}
          >
            Next
            <span>→</span>
          </button>

        </div>

      </footer>

    </main>
  );
}

export default ListPage;