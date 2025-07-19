import { createContext } from 'react';
import { FormatContextType } from './types';
import { BoxDisplayStyle, ColorActionType, InfoPaneActionType, StructureUpdateType } from '@/lib/types';
import { DEFAULT_SCALE_VALUE } from './constants';

/**
 * Default context value with proper typing
 */
const defaultContextValue: FormatContextType = {
  ctxStudyId: "",
  ctxStudyMetadata: {} as any,
  ctxSetStudyMetadata: () => {},
  ctxPassageProps: {} as any,
  ctxSetPassageProps: () => {},
  ctxScaleValue: DEFAULT_SCALE_VALUE,
  ctxIsHebrew: false,
  ctxSelectedWords: [],
  ctxSetSelectedWords: () => {},
  ctxNumSelectedWords: 0,
  ctxSetNumSelectedWords: () => {},
  ctxSelectedStrophes: [],
  ctxSetSelectedStrophes: () => {},
  ctxNumSelectedStrophes: 0,
  ctxSetNumSelectedStrophes: () => {},
  ctxColorAction: ColorActionType.none,
  ctxSelectedColor: "",
  ctxSetSelectedColor: () => {},
  ctxColorFill: "",
  ctxSetColorFill: () => {},
  ctxBorderColor: "",
  ctxSetBorderColor: () => {},
  ctxTextColor: "",
  ctxSetTextColor: () => {},
  ctxBoxDisplayStyle: BoxDisplayStyle.noBox,
  ctxIndentNum: 0,
  ctxSetIndentNum: () => {},
  ctxInViewMode: false,
  ctxStructureUpdateType: StructureUpdateType.none,
  ctxSetStructureUpdateType: () => {},
  ctxRootsColorMap: new Map(),
  ctxSetRootsColorMap: () => {},
  ctxHistory: [],
  ctxPointer: 0,
  ctxSetPointer: () => {},
  ctxAddToHistory: () => {}
};

/**
 * Format context for sharing state across StudyPane components
 */
export const FormatContext = createContext<FormatContextType>(defaultContextValue);
