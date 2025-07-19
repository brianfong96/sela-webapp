"use client";

import { AiOutlineClear } from "react-icons/ai";
import { useContext, useEffect, useState } from 'react';
import { FormatContext, DEFAULT_COLOR_FILL, DEFAULT_BORDER_COLOR, DEFAULT_TEXT_COLOR } from '../index';
import { ColorActionType } from "@/lib/types";
import { updateMetadataInDb } from "@/lib/actions";
import ToolTip from './ToolTip';

const ClearFormatBtn = ({ setColorAction }: { setColorAction: (arg: number) => void }) => {
  const { ctxStudyId, ctxStudyMetadata, ctxAddToHistory,
    ctxNumSelectedWords, ctxSelectedWords,
    ctxNumSelectedStrophes, ctxSelectedStrophes,
    ctxSetColorFill, ctxSetBorderColor, ctxSetTextColor
  } = useContext(FormatContext);

  const [buttonEnabled, setButtonEnabled] = useState(false);

  useEffect(() => {
    const hasSelectedItems = ctxNumSelectedWords > 0 || ctxNumSelectedStrophes > 0;
    setButtonEnabled(hasSelectedItems);
    if (!hasSelectedItems) {
      setColorAction(ColorActionType.none);
    }
  }, [ctxNumSelectedWords, ctxNumSelectedStrophes, setColorAction]);

  const handleClick = () => {
    if (!buttonEnabled) return;
    setColorAction(ColorActionType.resetColor);
    ctxSetColorFill(DEFAULT_COLOR_FILL);
    ctxSetBorderColor(DEFAULT_BORDER_COLOR);

    let isChanged = false;
    if (ctxSelectedWords.length > 0) {
      ctxSetTextColor(DEFAULT_TEXT_COLOR);
      ctxSelectedWords.forEach((word) => {
        const wordMetadata = ctxStudyMetadata.words[word.wordId];
        if (wordMetadata && wordMetadata?.color) {
          isChanged =
            (wordMetadata?.color?.fill !== undefined && wordMetadata?.color?.fill != DEFAULT_COLOR_FILL) ||
            (wordMetadata?.color?.border !== undefined && wordMetadata?.color?.border != DEFAULT_BORDER_COLOR) ||
            (wordMetadata?.color?.text !== undefined && wordMetadata?.color?.text != DEFAULT_TEXT_COLOR);
          delete wordMetadata["color"];
        }
      });
    }
    if (ctxSelectedStrophes.length > 0) {
      const selectedWordId = ctxSelectedStrophes[0].lines.at(0)?.words.at(0)?.wordId || 0;
      if (ctxStudyMetadata.words[selectedWordId].color) {
        isChanged =
          isChanged ||
          ctxStudyMetadata.words[selectedWordId].color?.fill != DEFAULT_COLOR_FILL ||
          ctxStudyMetadata.words[selectedWordId].color?.border != DEFAULT_BORDER_COLOR;
        delete ctxStudyMetadata.words[selectedWordId].color;
      }
    }
    if (isChanged) {
      ctxAddToHistory(ctxStudyMetadata);
      updateMetadataInDb(ctxStudyId, ctxStudyMetadata);
    }
  };

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick}
      >
        <AiOutlineClear className="ClickBlock" fillOpacity={buttonEnabled ? '1' : '0.4'} fontSize="1.4em" />
      </button>
      <ToolTip text="Clear format" />
    </div>
  );
};

export default ClearFormatBtn;
