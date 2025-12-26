import { useState, useRef, useEffect } from "react";

const ClientDropdown = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  const closeDropdown = () => {
    setOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  };

  const filteredOptions = Object.entries(options).filter(([label]) =>
    label.toLowerCase().includes(search.toLowerCase())
  );

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && itemsRef.current[highlightedIndex]) {
      itemsRef.current[highlightedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

    useEffect(() => {
      if (filteredOptions.length > 0) {
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex(-1);
      }
    }, [search, filteredOptions.length]);

  const handleKeyDown = (e) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          const [label] = filteredOptions[highlightedIndex];
          onChange(label);
          closeDropdown();
        }
        break;

      case "Escape":
        closeDropdown();
        break;

      default:
        break;
    }
  };

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`dropdown-control ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        {value || "Select Client"}
        <span className="arrow">▾</span>
      </div>

      {open && (
        <div className="dropdown-menu">
          <input
            type="text"
            className="dropdown-search"
            placeholder="Search client..."
            autoFocus
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!open) setOpen(true);
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {filteredOptions.length === 0 && (
            <div className="dropdown-empty">No results</div>
          )}

          {filteredOptions.map(([label, val], index) => (
            <div
              key={val}
              ref={(el) => (itemsRef.current[index] = el)}
              className={`dropdown-item ${
                index === highlightedIndex ? "active" : ""
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => {
                onChange(label);
                closeDropdown();
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
