import { useState, useRef, useEffect } from "react";

const ClientDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = Object.entries(options).filter(([label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div
        className={`dropdown-control ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value || "Select Client"}
        <span className="arrow">▾</span>
      </div>

      {open && (
        <div className="dropdown-menu">
          {/* Search Input */}
          <input
            type="text"
            className="dropdown-search"
            placeholder="Search client..."
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />

          {filteredOptions.length === 0 && (
            <div className="dropdown-empty">No results</div>
          )}

          {filteredOptions.map(([label, val]) => (
            <div
              key={val}
              className="dropdown-item"
              onClick={() => {
                onChange(label); // store label
                setOpen(false);
                setSearch("");
              }}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDropdown;
