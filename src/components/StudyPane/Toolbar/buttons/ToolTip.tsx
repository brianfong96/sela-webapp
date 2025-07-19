"use client";

const ToolTip = ({ text }: { text: string }) => {
  return (
    <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded bg-black px-4.5 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none">
      <span className="absolute left-1/2 top-[-3px] -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-black"></span>
      {text}
    </div>
  );
};

export default ToolTip;
