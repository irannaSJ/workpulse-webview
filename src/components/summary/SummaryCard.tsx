import type { SummaryCardData } from "../../types/summary";

interface SummaryCardProps {
  card: SummaryCardData;
  onClick?: (card: SummaryCardData) => void;
}

function SummaryCard({
  card,
  onClick,
}: SummaryCardProps) {
  const accent = card.accent ?? "blue";

  return (
    <div
      className={`summary-card summary-card-${accent} ${
        card.clickable
          ? "summary-card-clickable"
          : ""
      }`}
      onClick={() => {
        if (card.clickable) {
          onClick?.(card);
        }
      }}
      role={card.clickable ? "button" : undefined}
      tabIndex={card.clickable ? 0 : undefined}
    >
      <div className="summary-card-top">
        <div className="summary-card-title">
          {card.title}
        </div>

        {card.icon && (
          <div className="summary-card-icon">
            {card.icon}
          </div>
        )}
      </div>

      <div className="summary-card-value">
        {card.value}
      </div>

      {card.description && (
        <div className="summary-card-description">
          {card.description}
        </div>
      )}
    </div>
  );
}

export default SummaryCard;