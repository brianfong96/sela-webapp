"use client";

import { VscClearAll } from "react-icons/vsc";
import { useContext, useEffect, useState } from 'react';
import { FormatContext, DEFAULT_COLOR_FILL, DEFAULT_BORDER_COLOR, DEFAULT_TEXT_COLOR } from '../index';
import { ColorActionType } from "@/lib/types";
import { updateMetadataInDb } from "@/lib/actions";
import ToolTip from './ToolTip';

const ClearAllFormatBtn = ({ setColorAction }: { setColorAction: (arg: number) => void }) => {
  const { ctxStudyId, ctxStudyMetadata, ctxNumSelectedWords,
    ctxSetColorFill, ctxSetBorderColor, ctxSetTextColor,
    ctxAddToHistory, ctxSetRootsColorMap
  } = useContext(FormatContext);

  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    let hasCustomColor = false;
    Object.values(ctxStudyMetadata.words).forEach((wordMetadata) => {
      if (wordMetadata && wordMetadata?.color) {
        hasCustomColor = true;
      }
      if (wordMetadata && wordMetadata?.stropheMd && wordMetadata.stropheMd.color) {
        hasCustomColor = true;
      }
    });
    setButtonEnabled(hasCustomColor);
  }, [ctxNumSelectedWords, ctxStudyMetadata, setColorAction]);

  const handleClick = () => {
    setColorAction(ColorActionType.resetAllColor);
    ctxSetColorFill(DEFAULT_COLOR_FILL);
    ctxSetBorderColor(DEFAULT_BORDER_COLOR);
    ctxSetTextColor(DEFAULT_TEXT_COLOR);

    let isChanged = false;

    Object.values(ctxStudyMetadata.words).forEach((wordMetadata) => {
      if (wordMetadata && wordMetadata?.color) {
        isChanged = true;
        delete wordMetadata["color"];
      }
      if (wordMetadata && wordMetadata?.stropheMd && wordMetadata.stropheMd.color) {
        isChanged = true;
        delete wordMetadata.stropheMd.color;
      }
    });

    if (isChanged) {
      ctxSetRootsColorMap(new Map());
      ctxAddToHistory(ctxStudyMetadata);
      updateMetadataInDb(ctxStudyId, ctxStudyMetadata);
      setButtonEnabled(false);
    }
  };

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick}
      >
        <VscClearAll className="ClickBlock" fontSize="1.4em" opacity={buttonEnabled ? '1' : '0.4'} />
      </button>
      <ToolTip text="Clear all format" />
    </div>
  );
};

export default ClearAllFormatBtn;
