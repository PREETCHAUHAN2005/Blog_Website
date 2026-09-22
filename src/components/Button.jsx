export default function Button({
  children,
  type = "button",
  bgColor = "bg-[#1c1917]",
  textColor = "text-[#f6f3ee]",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex h-11 items-center justify-center px-5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
