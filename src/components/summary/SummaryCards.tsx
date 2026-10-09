import type { SummaryCardData } from "../../types/summary";
import SummaryCard from "./SummaryCard";

interface SummaryCardsProps {
  cards: SummaryCardData[];
  onCardClick?: (
    card: SummaryCardData
  ) => void;
}

function SummaryCards({
  cards,
  onCardClick,
}: SummaryCardsProps) {
  return (
    <section className="summary-cards-section">
      <div className="summary-cards-grid">
        {cards.map((card) => (
          <SummaryCard
            key={card.id}
            card={card}
            onClick={onCardClick}
          />
        ))}
      </div>
    </section>
  );
}

export default SummaryCards;