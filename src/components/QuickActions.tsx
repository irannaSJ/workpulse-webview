import type { QuickAction } from "../types/ui";
import QuickActionButton from "./QuickActionButton";

interface QuickActionsProps {
    actions : QuickAction[];
    onActionClick : (actions : QuickAction) => void;
}

function QuickActions({
  actions,
  onActionClick,
}: QuickActionsProps) {
  const enabledActions = actions.filter(
    (action) => action.enabled
  );

  return (
    <section className="quick-actions-section">
      <h2>Quick Actions</h2>

      <div className="quick-actions-grid">
        {enabledActions.map((action) => (
          <QuickActionButton
            key={action.id}
            title={action.title}
            icon={action.icon}
            onClick={() => onActionClick(action)}
          />
        ))}
      </div>
    </section>
  );
}

export default QuickActions;