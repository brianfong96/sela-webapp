"use client";

import React, { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";

export type WordAnalysisInfo = {
  hebrew: string;
  transliteration: string;
  gloss: string;
  strong: string;
  meaning: string;
};

const WordAnalysisModal = ({
  open,
  setOpen,
  info,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  info: WordAnalysisInfo;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modalRef.current) return;
      if (!open || modalRef.current.contains(target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [open, setOpen]);

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!open || key !== "Escape") return;
      setOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [open, setOpen]);

  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
        open ? "block" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-lg bg-white p-6 text-sm text-black dark:bg-boxdark dark:text-white"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <IconX size={18} />
        </button>
        <h3 className="mb-4 text-lg font-bold">Word analysis</h3>
        <p className="mb-4">
          {info.hebrew} ({info.transliteration}) {info.gloss} ({info.strong})
        </p>
        <div
          className="text-left"
          dangerouslySetInnerHTML={{ __html: info.meaning.replace(/\n/g, "<br/>") }}
        />
      </div>
    </div>
  );
};

export default WordAnalysisModal;
