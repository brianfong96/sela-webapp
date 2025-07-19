"use client";

import { LuUndo2 } from "react-icons/lu";
import { useContext } from 'react';
import { FormatContext } from '../index';
import ToolTip from './ToolTip';
import { updateMetadataInDb } from '@/lib/actions';

const UndoBtn = () => {
  const { ctxStudyId, ctxSetStudyMetadata, ctxHistory, ctxPointer, ctxSetPointer } = useContext(FormatContext);

  const buttonEnabled = ctxPointer !== 0;

  const handleClick = () => {
    if (buttonEnabled) {
      const newPointer = ctxPointer - 1;
      ctxSetPointer(newPointer);
      ctxSetStudyMetadata(structuredClone(ctxHistory[newPointer]));
      updateMetadataInDb(ctxStudyId, ctxHistory[newPointer]);
    }
  };

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center pl-3 px-1 xsm:flex-row">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick}
      >
        <LuUndo2 fontSize="1.5em" opacity={buttonEnabled ? '1' : '0.4'} />
      </button>
      <ToolTip text="Undo" />
    </div>
  );
};

export default UndoBtn;
