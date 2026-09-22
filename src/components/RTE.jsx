import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

function ToolButton({ children, onClick }) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="px-2 py-1 text-sm text-[#1c1917] hover:bg-[#efeae3]"
    >
      {children}
    </button>
  );
}

function EditorSurface({ value, onChange }) {
  const ref = useRef(null);
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current && ref.current) {
      ref.current.innerHTML = value || "";
      seeded.current = true;
    }
  }, [value]);

  const apply = (command, argument) => {
    ref.current?.focus();
    document.execCommand(command, false, argument);
    onChange(ref.current?.innerHTML || "");
  };

  return (
    <div className="border border-[#e4dfd8] bg-transparent">
      <div className="flex flex-wrap gap-1 border-b border-[#e4dfd8] px-2 py-1">
        <ToolButton onClick={() => apply("bold")}>Bold</ToolButton>
        <ToolButton onClick={() => apply("italic")}>Italic</ToolButton>
        <ToolButton onClick={() => apply("insertUnorderedList")}>List</ToolButton>
        <ToolButton onClick={() => apply("formatBlock", "h2")}>Heading</ToolButton>
        <ToolButton
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) apply("createLink", url);
          }}
        >
          Link
        </ToolButton>
      </div>
      <div
        ref={ref}
        className="post-body min-h-72 px-4 py-3 outline-none"
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder="Write the article"
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
    </div>
  );
}

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className="w-full">
      {label && <span className="mb-1 block text-sm text-[#6b6560]">{label}</span>}
      <Controller
        name={name || "content"}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <EditorSurface value={field.value} onChange={field.onChange} />
        )}
      />
    </div>
  );
}
