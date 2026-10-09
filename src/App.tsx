import { useEffect, useState } from "react";

import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getUiDefinition } from "./api/workpulseApi";

import type {
  WorkpulseSection,
  WorkpulseUiDefinition,
} from "./types/uiDefinition";

import { HomePage } from "./pages/HomePage";
import { ListPage } from "./pages/ListPage";
import FormPage from "./pages/FormPage";

const CONFIGURATION_ID = "WWVC-01";


/* =========================================================
   Find Section
   ========================================================= */

function findSection(
  definition: WorkpulseUiDefinition,
  sectionId: string | undefined,
): WorkpulseSection | null {
  if (!sectionId) {
    return null;
  }

  return (
    definition.sections.find(
      (section) =>
        section.id === sectionId &&
        section.enabled,
    ) ?? null
  );
}


/* =========================================================
   Home Route
   ========================================================= */

interface HomeRouteProps {
  definition: WorkpulseUiDefinition;
}

function HomeRoute({
  definition,
}: HomeRouteProps) {
  const navigate = useNavigate();

  const handleSelectSection = (
    section: WorkpulseSection,
  ) => {
    if (section.type === "FORM") {
      navigate(
        `/form/${encodeURIComponent(section.id)}`,
      );

      return;
    }

    if (section.type === "LIST") {
      navigate(
        `/list/${encodeURIComponent(section.id)}`,
      );
    }
  };

  return (
    <HomePage
      definition={definition}
      onSelectSection={handleSelectSection}
    />
  );
}


/* =========================================================
   List Route
   ========================================================= */

interface ListRouteProps {
  definition: WorkpulseUiDefinition;
}

function ListRoute({
  definition,
}: ListRouteProps) {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  const section = findSection(
    definition,
    sectionId,
  );

  if (!section || section.type !== "LIST") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell">

      <ListPage
        configuration={
          definition.configuration.id
        }
        section={section}
        onBack={() => navigate("/")}
      />

    </div>
  );
}


/* =========================================================
   Form Route
   ========================================================= */

interface FormRouteProps {
  definition: WorkpulseUiDefinition;
}

function FormRoute({
  definition,
}: FormRouteProps) {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  const section = findSection(
    definition,
    sectionId,
  );

  if (!section || section.type !== "FORM") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="app-shell">

      <FormPage
        section={section}
        onBack={() => navigate("/")}
      />

    </div>
  );
}


/* =========================================================
   Application Content
   ========================================================= */

function AppContent() {
  const [
    definition,
    setDefinition,
  ] = useState<WorkpulseUiDefinition | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);


  /* =======================================================
     Load Definition
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadDefinition() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getUiDefinition(
            CONFIGURATION_ID,
          );

        if (!mounted) {
          return;
        }

        setDefinition(data);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Workpulse configuration.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDefinition();

    return () => {
      mounted = false;
    };
  }, []);


  /* =======================================================
     Loading
     ======================================================= */

  if (loading) {
    return (
      <div className="app-state">
        <div className="app-state__content">

          <div className="app-state__spinner" />

          <p>
            Loading Workpulse...
          </p>

        </div>
      </div>
    );
  }


  /* =======================================================
     Error
     ======================================================= */

  if (error) {
    return (
      <div className="app-state">
        <div className="app-state__content">

          <h2>
            Unable to load Workpulse
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
          >
            Retry
          </button>

        </div>
      </div>
    );
  }


  /* =======================================================
     No Definition
     ======================================================= */

  if (!definition) {
    return (
      <div className="app-state">
        <div className="app-state__content">

          <h2>
            No configuration available
          </h2>

        </div>
      </div>
    );
  }


  /* =======================================================
     Routes
     ======================================================= */

  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={
          <div className="app-shell">
            <main className="app-shell__content">
              <HomeRoute
                definition={definition}
              />
            </main>
          </div>
        }
      />

      {/* FORM */}
      <Route
        path="/form/:sectionId"
        element={
          <FormRoute
            definition={definition}
          />
        }
      />

      {/* LIST */}
      <Route
        path="/list/:sectionId"
        element={
          <ListRoute
            definition={definition}
          />
        }
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}


/* =========================================================
   App
   ========================================================= */

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}


export default App;