"use client";

import {
  LuArrowUpToLine,
  LuArrowDownToLine,
  LuArrowUpNarrowWide,
  LuArrowDownWideNarrow,
} from "react-icons/lu";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { CgArrowsBreakeV, CgArrowsBreakeH } from "react-icons/cg";
import { useContext } from 'react';
import { FormatContext } from '../index';
import { StructureUpdateType, StropheProps } from "@/lib/types";
import ToolTip from './ToolTip';

const areStrophesContiguous = (strophes: StropheProps[]): boolean => {
  if (strophes.length <= 1) return true;

  const sorted = [...strophes].sort((a, b) => a.lines[0].words[0].wordId - b.lines[0].words[0].wordId);

  for (let i = 0; i < sorted.length - 1; i++) {
    const currentLastWordId = sorted[i].lines.at(-1)?.words.at(-1)?.wordId;
    const nextFirstWordId = sorted[i + 1].lines[0].words[0].wordId;

    if (currentLastWordId === undefined || nextFirstWordId !== currentLastWordId + 1) {
      return false;
    }
  }

  return true;
};

const StructureUpdateBtn = ({ updateType, toolTip }: { updateType: StructureUpdateType; toolTip: string }) => {
  const {
    ctxIsHebrew,
    ctxSelectedWords,
    ctxSetStructureUpdateType,
    ctxNumSelectedStrophes,
    ctxSelectedStrophes,
    ctxPassageProps,
  } = useContext(FormatContext);

  let buttonEnabled = false;
  const hasWordSelected = ctxSelectedWords.length > 0;
  const singleWordSelected = ctxSelectedWords.length === 1;
  const hasStropheSelected = ctxSelectedStrophes.length === 1;
  const hasStrophesSelected = ctxNumSelectedStrophes >= 1 && ctxPassageProps.stropheCount > 1 && ctxSelectedStrophes[0] !== undefined;

  const sortedWords = [...ctxSelectedWords].sort((a, b) => a.wordId - b.wordId);
  const firstSelectedWord = sortedWords[0];
  const lastSelectedWord = sortedWords[sortedWords.length - 1];
  const sortedStrophes = [...ctxSelectedStrophes].sort((a, b) => a.lines[0].words[0].wordId - b.lines[0].words[0].wordId);
  const firstSelectedStrophe = sortedStrophes[0];
  const lastSelectedStrophe = sortedStrophes[sortedStrophes.length - 1];

  if (updateType === StructureUpdateType.newLine) {
    if (hasWordSelected && firstSelectedWord) {
      const sameStrophe = ctxSelectedWords.every(w => w.stropheId === firstSelectedWord.stropheId);
      let wholeLine = false;
      const sameLine = ctxSelectedWords.every(
        w => w.lineId === firstSelectedWord.lineId && w.stropheId === firstSelectedWord.stropheId
      );
      if (sameLine) {
        const lineWords = ctxPassageProps.stanzaProps[firstSelectedWord.stanzaId].strophes[firstSelectedWord.stropheId].lines[firstSelectedWord.lineId].words.length;
        wholeLine = ctxSelectedWords.length === lineWords;
      }
      buttonEnabled = sameStrophe && !wholeLine;
    } else {
      buttonEnabled = false;
    }
  } else if (updateType === StructureUpdateType.mergeWithPrevLine) {
    buttonEnabled = hasWordSelected && firstSelectedWord && firstSelectedWord.lineId !== 0;
  } else if (updateType === StructureUpdateType.mergeWithNextLine) {
    buttonEnabled =
      hasWordSelected &&
      lastSelectedWord &&
      ctxPassageProps.stanzaProps[lastSelectedWord.stanzaId].strophes[lastSelectedWord.stropheId]?.lines?.length - 1 !==
        lastSelectedWord.lineId;
  } else if (updateType === StructureUpdateType.newStrophe) {
    buttonEnabled = hasWordSelected && !!firstSelectedWord;
  } else if (updateType === StructureUpdateType.mergeWithPrevStrophe) {
    buttonEnabled =
      (hasWordSelected && firstSelectedWord && !firstSelectedWord.firstStropheInStanza) ||
      (hasStropheSelected && firstSelectedStrophe && !firstSelectedStrophe.firstStropheInStanza);
  } else if (updateType === StructureUpdateType.mergeWithNextStrophe) {
    buttonEnabled =
      (hasWordSelected && lastSelectedWord && !lastSelectedWord.lastStropheInStanza) ||
      (hasStropheSelected && lastSelectedStrophe && !lastSelectedStrophe.lastStropheInStanza);
  } else if (updateType === StructureUpdateType.newStanza) {
    buttonEnabled = hasStrophesSelected && !!firstSelectedStrophe && areStrophesContiguous(ctxSelectedStrophes);
  } else if (updateType === StructureUpdateType.mergeWithPrevStanza) {
    buttonEnabled =
      hasStrophesSelected &&
      ctxSelectedStrophes[0].lines[0].words[0].stanzaId !== undefined &&
      ctxSelectedStrophes[0].lines[0].words[0].stanzaId > 0 &&
      areStrophesContiguous(ctxSelectedStrophes);
  } else if (updateType === StructureUpdateType.mergeWithNextStanza) {
    buttonEnabled =
      hasStrophesSelected &&
      ctxSelectedStrophes[0].lines[0].words[0].stanzaId !== undefined &&
      ctxSelectedStrophes[0].lines[0].words[0].stanzaId < ctxPassageProps.stanzaCount - 1 &&
      areStrophesContiguous(ctxSelectedStrophes);
  }

  const handleClick = () => {
    buttonEnabled && ctxSetStructureUpdateType(updateType);
  };

  return (
    <div className="flex flex-col group relative inline-block items-center justify-center px-2 xsm:flex-row">
      <button className={`hover:text-primary ${buttonEnabled ? '' : 'pointer-events-none'}`} onClick={handleClick}>
        {updateType === StructureUpdateType.newLine && (
          <MdOutlinePlaylistAdd opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        {updateType === StructureUpdateType.mergeWithPrevLine && (
          <LuArrowUpToLine opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        {updateType === StructureUpdateType.mergeWithNextLine && (
          <LuArrowDownToLine opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        {updateType === StructureUpdateType.newStrophe && (
          <CgArrowsBreakeV opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        {updateType === StructureUpdateType.mergeWithPrevStrophe && (
          <LuArrowUpNarrowWide opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        {updateType === StructureUpdateType.mergeWithNextStrophe && (
          <LuArrowDownWideNarrow opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        {updateType === StructureUpdateType.newStanza && (
          <CgArrowsBreakeH opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        )}
        {(updateType == StructureUpdateType.mergeWithPrevStanza && !ctxIsHebrew) ||
        (updateType == StructureUpdateType.mergeWithNextStanza && ctxIsHebrew) ? (
          <LuArrowDownWideNarrow style={{ transform: 'rotate(90deg)' }} opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        ) : null}
        {(updateType == StructureUpdateType.mergeWithNextStanza && !ctxIsHebrew) ||
        (updateType == StructureUpdateType.mergeWithPrevStanza && ctxIsHebrew) ? (
          <LuArrowUpNarrowWide style={{ transform: 'rotate(90deg)' }} opacity={buttonEnabled ? '1' : '0.4'} fontSize="1.5em" />
        ) : null}
        <ToolTip text={toolTip} />
      </button>
    </div>
  );
};

export default StructureUpdateBtn;
