"use client";

import { CgFormatIndentIncrease, CgFormatIndentDecrease } from "react-icons/cg";
import { useContext, useEffect, useState } from 'react';
import { FormatContext } from '../index';
import { BoxDisplayStyle } from "@/lib/types";
import { updateMetadataInDb } from "@/lib/actions";
import ToolTip from './ToolTip';

const IndentBtn = ({ leftIndent }: { leftIndent: boolean }) => {
  const { ctxStudyId, ctxIsHebrew, ctxStudyMetadata, ctxBoxDisplayStyle, ctxIndentNum, ctxSetIndentNum,
    ctxSelectedWords, ctxNumSelectedWords, ctxAddToHistory } = useContext(FormatContext);
  const [buttonEnabled, setButtonEnabled] = useState(
    ctxBoxDisplayStyle === BoxDisplayStyle.uniformBoxes && ctxNumSelectedWords === 1
  );

  useEffect(() => {
    let indentNum = 0;
    if (ctxSelectedWords.length === 1) {
      const wordMetadata = ctxStudyMetadata.words[ctxSelectedWords[0].wordId];
      indentNum = wordMetadata ? wordMetadata.indent || 0 : 0;
      ctxSetIndentNum(indentNum);
    }
    const validIndent = !leftIndent ? ctxIndentNum > 0 : ctxIndentNum < 3;
    setButtonEnabled(
      ctxBoxDisplayStyle === BoxDisplayStyle.uniformBoxes && ctxNumSelectedWords === 1 && validIndent
    );
  }, [ctxBoxDisplayStyle, ctxNumSelectedWords, ctxSelectedWords, ctxStudyMetadata, ctxIndentNum, ctxIsHebrew, ctxSetIndentNum, leftIndent]);

  const handleClick = () => {
    if (ctxBoxDisplayStyle !== BoxDisplayStyle.uniformBoxes || ctxSelectedWords.length === 0) return;

    const selectedWordId = ctxSelectedWords[0].wordId;
    const wordMetadata = ctxStudyMetadata.words[selectedWordId];
    let indentNum = wordMetadata ? wordMetadata.indent || 0 : 0;
    if (!leftIndent) {
      if (indentNum > 0) {
        ctxStudyMetadata.words[selectedWordId] = {
          ...ctxStudyMetadata.words[selectedWordId],
          indent: --indentNum,
        } as any;
        indentNum == 0 && delete ctxStudyMetadata.words[selectedWordId].indent;
        ctxSetIndentNum(indentNum);
        ctxAddToHistory(ctxStudyMetadata);
        updateMetadataInDb(ctxStudyId, ctxStudyMetadata);
        setButtonEnabled(indentNum > 0);
      }
    } else {
      if (indentNum < 3) {
        ctxStudyMetadata.words[selectedWordId] = {
          ...ctxStudyMetadata.words[selectedWordId],
          indent: ++indentNum,
        } as any;
        ctxSetIndentNum(indentNum);
        ctxAddToHistory(ctxStudyMetadata);
        updateMetadataInDb(ctxStudyId, ctxStudyMetadata);
        setButtonEnabled(indentNum < 3);
      }
    }
  };
  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row hbFontExemption ">
      <button
        className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`}
        onClick={handleClick}
      >
        {(!ctxIsHebrew && leftIndent) || (ctxIsHebrew && !leftIndent) ? (
          <CgFormatIndentIncrease fillOpacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        ) : (
          <CgFormatIndentDecrease fillOpacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
      </button>
      <ToolTip text={leftIndent ? 'Add indent' : 'Remove indent'} />
    </div>
  );
};

export default IndentBtn;
