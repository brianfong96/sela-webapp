"use client";

import { LuRedo2 } from "react-icons/lu";
import { useContext } from 'react';
import { FormatContext } from '../index';
import { updateMetadataInDb } from '@/lib/actions';
import ToolTip from './ToolTip';

const RedoBtn = () => {
  const { ctxStudyId, ctxSetStudyMetadata, ctxHistory, ctxPointer, ctxSetPointer } = useContext(FormatContext);

  const buttonEnabled = ctxPointer !== ctxHistory.length - 1;

  const handleClick = () => {
    if (buttonEnabled) {
      const newPointer = ctxPointer + 1;
      ctxSetPointer(newPointer);
      ctxSetStudyMetadata(structuredClone(ctxHistory[newPointer]));
      updateMetadataInDb(ctxStudyId, ctxHistory[newPointer]);
    }
  };
  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-3 dark:border-strokedark xsm:flex-row">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick}
      >
        <LuRedo2 fontSize="1.5em" opacity={buttonEnabled ? '1' : '0.4'} />
      </button>
      <ToolTip text="Redo" />
    </div>
  );
};

export default RedoBtn;
