import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      name,
      label,
      error,
      required = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-(--foreground) mb-1"
          >
            {label} {required && <span className="text-error">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
          {...props}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 
            bg-(--background) text-(--foreground)
            ${
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-(--border) focus:border-primary focus:ring-primary/20'
            }`}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
