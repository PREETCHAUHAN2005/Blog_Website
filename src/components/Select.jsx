import { forwardRef, useId } from "react";

const Select = forwardRef(function Select(
  { options = [], label, className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm text-[#6b6560]">
          {label}
        </label>
      )}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`h-11 w-full border border-[#e4dfd8] bg-transparent px-3 text-[#1c1917] outline-none focus:border-[#1c1917] ${className}`}
      >
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option : option.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
});

export default Select;
