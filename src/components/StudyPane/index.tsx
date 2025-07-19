'use client';

import React from "react";

// Import modular components and hooks
import { FormatContextProvider } from './FormatContextProvider';
import { StudyPaneLayout } from './StudyPaneLayout';
import { 
  usePassageState, 
  useSelectionState, 
  useColorState, 
  useUIState, 
  useHistoryState 
} from './hooks';
import { useDataInitialization } from './useDataInitialization';
import { StudyPaneProps, FormatContextType } from './types';

// Export context and constants for external use
export { FormatContext } from './context';
export { 
  DEFAULT_SCALE_VALUE, 
  DEFAULT_COLOR_FILL, 
  DEFAULT_BORDER_COLOR, 
  DEFAULT_TEXT_COLOR 
} from './constants';

/**
 * Main StudyPane component - refactored for modularity and maintainability
 */
const StudyPane: React.FC<StudyPaneProps> = ({
  passageData,
  content,
  inViewMode
}) => {
  // Use custom hooks to manage different aspects of state
  const passageState = usePassageState(passageData);
  const selectionState = useSelectionState();
  const colorState = useColorState();
  const uiState = useUIState();
  const historyState = useHistoryState(passageData.study.metadata);

  // Handle data initialization and migration
  useDataInitialization(
    passageData,
    content,
    passageState.studyMetadata,
    passageState.setStudyMetadata,
    passageState.setPassageProps,
    colorState.setBoxDisplayStyle
  );

  // Create context value from all state hooks
  const formatContextValue: FormatContextType = {
    ctxStudyId: passageData.study.id,
    ctxStudyMetadata: passageState.studyMetadata,
    ctxSetStudyMetadata: passageState.setStudyMetadata,
    ctxPassageProps: passageState.passageProps,
    ctxSetPassageProps: passageState.setPassageProps,
    ctxScaleValue: passageState.scaleValue,
    ctxIsHebrew: passageState.isHebrew,
    ctxSelectedWords: selectionState.selectedWords,
    ctxSetSelectedWords: selectionState.setSelectedWords,
    ctxNumSelectedWords: selectionState.numSelectedWords,
    ctxSetNumSelectedWords: selectionState.setNumSelectedWords,
    ctxSelectedStrophes: selectionState.selectedStrophes,
    ctxSetSelectedStrophes: selectionState.setSelectedStrophes,
    ctxNumSelectedStrophes: selectionState.numSelectedStrophes,
    ctxSetNumSelectedStrophes: selectionState.setNumSelectedStrophes,
    ctxColorAction: colorState.colorAction,
    ctxSelectedColor: colorState.selectedColor,
    ctxSetSelectedColor: colorState.setSelectedColor,
    ctxColorFill: colorState.colorFill,
    ctxSetColorFill: colorState.setColorFill,
    ctxBorderColor: colorState.borderColor,
    ctxSetBorderColor: colorState.setBorderColor,
    ctxTextColor: colorState.textColor,
    ctxSetTextColor: colorState.setTextColor,
    ctxBoxDisplayStyle: colorState.boxDisplayStyle,
    ctxIndentNum: colorState.indentNum,
    ctxSetIndentNum: colorState.setIndentNum,
    ctxInViewMode: inViewMode,
    ctxStructureUpdateType: uiState.structureUpdateType,
    ctxSetStructureUpdateType: uiState.setStructureUpdateType,
    ctxRootsColorMap: uiState.rootsColorMap,
    ctxSetRootsColorMap: uiState.setRootsColorMap,
    ctxHistory: historyState.history,
    ctxPointer: historyState.pointer,
    ctxSetPointer: historyState.setPointer,
    ctxAddToHistory: historyState.addToHistory
  };

  return (
    <FormatContextProvider value={formatContextValue}>
      <StudyPaneLayout
        passageData={passageData}
        isHebrew={passageState.isHebrew}
        infoPaneAction={uiState.infoPaneAction}
        setInfoPaneAction={uiState.setInfoPaneAction}
        setHebrew={passageState.setHebrew}
        setScaleValue={passageState.setScaleValue}
        setColorAction={colorState.setColorAction}
        setSelectedColor={colorState.setSelectedColor}
        setBoxDisplayStyle={colorState.setBoxDisplayStyle}
        cloneStudyOpen={uiState.cloneStudyOpen}
        setCloneStudyOpen={uiState.setCloneStudyOpen}
      />
    </FormatContextProvider>
  );
};

export default StudyPane;

