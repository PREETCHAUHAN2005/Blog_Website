import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, type = "text", className = "", error, ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm text-[#6b6560]" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`h-11 w-full border border-[#e4dfd8] bg-transparent px-3 text-[#1c1917] outline-none focus:border-[#1c1917] ${className}`}
        ref={ref}
        id={id}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#8a2b2b]">{error}</p>}
    </div>
  );
});

export default Input;
