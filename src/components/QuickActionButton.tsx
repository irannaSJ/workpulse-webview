interface QuickActionButtonProps{
    title : string;
    icon? : string | null;
    onClick : () => void;
}

function QuickActionButton({
    title,
    icon,
    onClick
}: QuickActionButtonProps){
    return (
        <button
      className="quick-action-button"
      onClick={onClick}
    >
      {icon && (
        <span className="quick-action-icon">
          {icon}
        </span>
      )}

      <span className="quick-action-title">
        {title}
      </span>
    </button>
    )
}

export default QuickActionButton;