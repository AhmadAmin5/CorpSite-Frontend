import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

const Select = ({
  value,
  onChange,
  options = [],
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);

  // 1. Calculate position when opening
  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4, // 4px gap below button
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Recalculate on scroll or resize to keep it attached
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  // 2. Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdownElement = document.getElementById('select-dropdown-portal');
      const clickedInsideDropdown = dropdownElement?.contains(event.target);
      const clickedInsideTrigger = containerRef.current?.contains(event.target);

      if (!clickedInsideDropdown && !clickedInsideTrigger) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (newValue) => {
    if (!disabled) {
      onChange(newValue);
      setIsOpen(false);
    }
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-(--foreground) mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            updatePosition(); // Calculate immediately before opening
            setIsOpen(!isOpen);
          }
        }}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-3 py-2 border rounded-lg 
          bg-(--background) text-left transition-all duration-200
          focus:outline-none focus:ring-2 
          ${
            error
              ? 'border-error focus:border-error focus:ring-error/20'
              : 'border-(--border) focus:border-primary focus:ring-primary/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}
        `}
      >
        <span className={!value ? 'text-(--secondary)' : 'text-(--foreground)'}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-(--secondary) transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Portal Dropdown Menu */}
      {isOpen &&
        createPortal(
          <div
            id="select-dropdown-portal"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
            }}
            className="absolute z-9999 bg-(--card) border border-(--border) rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100 origin-top"
          >
            <div className="p-1 max-h-60 overflow-y-auto">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors
                      ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-(--foreground) hover:bg-(--secondary)/10'
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                );
              })}
              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-(--secondary) text-center">
                  No options available
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default Select;
