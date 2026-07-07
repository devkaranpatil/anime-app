import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/CustomDropdown.css";

export type DropdownOption<T extends string | number> = {
  value: T;
  label: string;
};

interface CustomDropdownProps<T extends string | number> {
  options: DropdownOption<T>[];
  value?: T | T[] | null;
  onChange: (value: T | T[] | null) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  className?: string;
}

const CustomDropdown = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  multiple = false,
  disabled = false,
  emptyMessage = "No options available.",
  className = "",
}: CustomDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabels = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return options
        .filter((option) => value.includes(option.value))
        .map((option) => option.label);
    }

    if (!multiple && value != null) {
      const selectedOption = options.find((option) => option.value === value);
      return selectedOption ? [selectedOption.label] : [];
    }

    return [];
  }, [multiple, options, value]);

  const displayText = useMemo(() => {
    if (multiple) {
      return selectedLabels.length > 0
        ? selectedLabels.join(", ")
        : placeholder;
    }

    return selectedLabels[0] ?? placeholder;
  }, [multiple, placeholder, selectedLabels]);

  const toggleOption = (optionValue: T) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const nextValues = currentValues.includes(optionValue)
        ? currentValues.filter((item) => item !== optionValue)
        : [...currentValues, optionValue];

      onChange(nextValues);
      return;
    }

    onChange(optionValue);
    setIsOpen(false);
  };

  const isOptionSelected = (optionValue: T) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue);
    }

    return !multiple && value === optionValue;
  };

  return (
    <div ref={dropdownRef} className={`custom-dropdown ${className}`.trim()}>
      <button
        type="button"
        className="custom-dropdown__trigger"
        onClick={() => !disabled && setIsOpen((current) => !current)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="custom-dropdown__trigger-text">{displayText}</span>
        <span className="custom-dropdown__arrow">{isOpen ? "▴" : "▾"}</span>
      </button>

      {isOpen && !disabled && (
        <div className="custom-dropdown__menu" role="listbox">
          {options.length > 0 ? (
            options.map((option) => {
              const selected = isOptionSelected(option.value);

              return (
                <button
                  key={String(option.value)}
                  type="button"
                  className={`custom-dropdown__option ${selected ? "is-selected" : ""}`.trim()}
                  onClick={() => toggleOption(option.value)}
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
