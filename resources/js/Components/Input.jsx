import React from 'react';

export function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  helperText,
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-lavender focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 ${
          error ? 'border-red-400 bg-red-50/20' : 'border-ink/15 hover:border-ink/30'
        }`}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-ink-soft">{helperText}</p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  required = false,
  className = '',
  helperText,
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id || name}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-lavender focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 resize-y ${
          error ? 'border-red-400 bg-red-50/20' : 'border-ink/15 hover:border-ink/30'
        }`}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-ink-soft">{helperText}</p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Select an option',
  required = false,
  className = '',
  helperText,
  ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full rounded-xl border bg-white pl-4 pr-10 py-3 text-sm text-ink transition-colors focus:border-lavender focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender/40 ${
            error ? 'border-red-400 bg-red-50/20' : 'border-ink/15 hover:border-ink/30'
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {helperText && !error && (
        <p className="text-xs text-ink-soft">{helperText}</p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
