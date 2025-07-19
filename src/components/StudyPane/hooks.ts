import { useState } from 'react';
import { ColorData, PassageProps, StropheProps, WordProps, StudyMetadata } from '@/lib/data';
import { ColorActionType, InfoPaneActionType, StructureUpdateType, BoxDisplayStyle } from '@/lib/types';
import { DEFAULT_SCALE_VALUE, DEFAULT_COLOR_FILL, DEFAULT_BORDER_COLOR, DEFAULT_TEXT_COLOR } from './constants';

/**
 * Custom hook for managing passage state
 */
export const usePassageState = (passageData: any) => {
  const [passageProps, setPassageProps] = useState<PassageProps>({ 
    stanzaProps: [], 
    stanzaCount: 0, 
    stropheCount: 0 
  });
  
  const [studyMetadata, setStudyMetadata] = useState<StudyMetadata>(passageData.study.metadata);
  const [scaleValue, setScaleValue] = useState(passageData.study.metadata?.scaleValue || DEFAULT_SCALE_VALUE);
  const [isHebrew, setHebrew] = useState(false);

  return {
    passageProps,
    setPassageProps,
    studyMetadata,
    setStudyMetadata,
    scaleValue,
    setScaleValue,
    isHebrew,
    setHebrew
  };
};

/**
 * Custom hook for managing selection state
 */
export const useSelectionState = () => {
  const [numSelectedWords, setNumSelectedWords] = useState(0);
  const [selectedWords, setSelectedWords] = useState<WordProps[]>([]);
  const [selectedStrophes, setSelectedStrophes] = useState<StropheProps[]>([]);
  const [numSelectedStrophes, setNumSelectedStrophes] = useState(0);

  return {
    numSelectedWords,
    setNumSelectedWords,
    selectedWords,
    setSelectedWords,
    selectedStrophes,
    setSelectedStrophes,
    numSelectedStrophes,
    setNumSelectedStrophes
  };
};

/**
 * Custom hook for managing color and styling state
 */
export const useColorState = () => {
  const [colorAction, setColorAction] = useState(ColorActionType.none);
  const [selectedColor, setSelectedColor] = useState("");
  const [colorFill, setColorFill] = useState(DEFAULT_COLOR_FILL);
  const [borderColor, setBorderColor] = useState(DEFAULT_BORDER_COLOR);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [boxDisplayStyle, setBoxDisplayStyle] = useState(BoxDisplayStyle.noBox);
  const [indentNum, setIndentNum] = useState(0);

  return {
    colorAction,
    setColorAction,
    selectedColor,
    setSelectedColor,
    colorFill,
    setColorFill,
    borderColor,
    setBorderColor,
    textColor,
    setTextColor,
    boxDisplayStyle,
    setBoxDisplayStyle,
    indentNum,
    setIndentNum
  };
};

/**
 * Custom hook for managing UI state
 */
export const useUIState = () => {
  const [infoPaneAction, setInfoPaneAction] = useState(InfoPaneActionType.none);
  const [structureUpdateType, setStructureUpdateType] = useState(StructureUpdateType.none);
  const [rootsColorMap, setRootsColorMap] = useState<Map<number, ColorData>>(new Map());
  const [cloneStudyOpen, setCloneStudyOpen] = useState(false);

  return {
    infoPaneAction,
    setInfoPaneAction,
    structureUpdateType,
    setStructureUpdateType,
    rootsColorMap,
    setRootsColorMap,
    cloneStudyOpen,
    setCloneStudyOpen
  };
};

/**
 * Custom hook for managing history state
 */
export const useHistoryState = (initialMetadata: StudyMetadata) => {
  const [history, setHistory] = useState<StudyMetadata[]>([structuredClone(initialMetadata)]);
  const [pointer, setPointer] = useState(0);

  const addToHistory = (updatedMetadata: StudyMetadata) => { 
    const clonedObj = structuredClone(updatedMetadata);
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(clonedObj);
    setHistory(newHistory);
    setPointer(pointer + 1);
  };

  return {
    history,
    setHistory,
    pointer,
    setPointer,
    addToHistory
  };
};
