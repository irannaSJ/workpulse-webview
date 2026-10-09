import "./TopBar.css"

interface TopBarProps {
    title : string;
    logo? : string | null;
}

function TopBar({title, logo}: TopBarProps){
    return (
        <header className="top-bar">
      <div className="top-bar-content">
        {logo && (
          <img
            src={logo}
            alt={title}
            className="top-bar-logo"
          />
        )}

        <h1 className="top-bar-title">
          {title}
        </h1>
      </div>
    </header>
    );
}

export default TopBar;