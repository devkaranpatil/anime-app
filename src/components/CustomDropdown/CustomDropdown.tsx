import { useState } from "react";
import "../../styles/CustomDropdown.css";

export type DropdownOption = {
  value: string | number;
  label: string;
};

interface CustomDropdownProps {
  options: DropdownOption[];
  selectedValues: Array<string | number>;
  onChange: (value: Array<string | number>) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
  multiple?: boolean;
}

const CustomDropdown = ({
  options,
  selectedValues,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  emptyMessage = "No options available.",
  multiple = true,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const labels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);
  const buttonText = labels.length > 0 ? labels.join(", ") : placeholder;

  const handleOptionClick = (value: string | number) => {
    if (!multiple) {
      onChange([value]);
      setIsOpen(false);
      return;
    }

    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="custom-dropdown">
      <button
        type="button"
        className="custom-dropdown__trigger"
        onClick={() => !disabled && setIsOpen((current) => !current)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="custom-dropdown__trigger-text">{buttonText}</span>
        <span className="custom-dropdown__arrow">{isOpen ? "▴" : "▾"}</span>
      </button>

      {isOpen && !disabled && (
        <div className="custom-dropdown__menu" role="listbox">
          {options.length > 0 ? (
            options.map((option) => {
              const selected = selectedValues.includes(option.value);

              return (
                <button
                  key={String(option.value)}
                  type="button"
                  className={`custom-dropdown__option ${selected ? "is-selected" : ""}`.trim()}
                  onClick={() => handleOptionClick(option.value)}
                >
                  <span className="custom-dropdown__check">
                    {selected ? "✓" : "○"}
                  </span>
                  <span>{option.label}</span>
                </button>
              );
            })
          ) : (
            <p className="custom-dropdown__empty">{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
