import type {
  WorkpulseSection,
  WorkpulseUiDefinition,
} from "../types/uiDefinition";

import "./HomePage.css";

interface HomePageProps {
  definition: WorkpulseUiDefinition;

  onSelectSection: (
    section: WorkpulseSection,
  ) => void;
}

export function HomePage({
  definition,
  onSelectSection,
}: HomePageProps) {
  const sections = definition.sections.filter(
    (section) => section.enabled,
  );

  return (
    <main className="workpulse-home">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="workpulse-home__hero">
        <div className="workpulse-home__hero-content">

          <div className="workpulse-home__hero-badge">
            <span className="workpulse-home__hero-badge-dot" />
            WorkPulse
          </div>

          <h1 className="workpulse-home__title">
            {definition.configuration.title}
          </h1>

          <p className="workpulse-home__subtitle">
            Everything you need to manage your workspace,
            all in one place.
          </p>

        </div>
      </section>


      {/* =====================================================
          QUICK ACTIONS
          ===================================================== */}

      <section className="workpulse-home__actions">

        <div className="workpulse-home__section-header">

          <div>
            <span className="workpulse-home__section-eyebrow">
              WORKSPACE
            </span>

            <h2 className="workpulse-home__section-title">
              Quick Actions
            </h2>

            <p className="workpulse-home__section-subtitle">
              Choose a module to get started.
            </p>
          </div>

          <span className="workpulse-home__module-count">
            {sections.length}{" "}
            {sections.length === 1
              ? "module"
              : "modules"}
          </span>

        </div>


        <div className="workpulse-home__grid">

          {sections.map((section) => (

            <button
              key={section.id}
              type="button"
              className="workpulse-quick-action"
              onClick={() =>
                onSelectSection(section)
              }
            >

              <div
                className={`workpulse-quick-action__icon workpulse-quick-action__icon--${
                  section.type.toLowerCase()
                }`}
              >
                <span>
                  {section.type === "FORM"
                    ? "+"
                    : "≡"}
                </span>
              </div>


              <div className="workpulse-quick-action__content">

                <span className="workpulse-quick-action__title">
                  {section.sourceDoctype}
                </span>

                <span className="workpulse-quick-action__type">
                  {section.type === "FORM"
                    ? "Create new record"
                    : "View records"}
                </span>

              </div>


              <span className="workpulse-quick-action__arrow">
                →
              </span>

            </button>

          ))}

        </div>

      </section>

    </main>
  );
}