import { ColorData, PassageProps, StropheProps, WordProps, StudyMetadata } from '@/lib/data';
import { ColorActionType, InfoPaneActionType, StructureUpdateType, BoxDisplayStyle } from "@/lib/types";

/**
 * Type definitions for FormatContext
 */
export interface FormatContextType {
  // Study data
  ctxStudyId: string;
  ctxStudyMetadata: StudyMetadata;
  ctxSetStudyMetadata: (arg: StudyMetadata) => void;
  
  // Passage props
  ctxPassageProps: PassageProps;
  ctxSetPassageProps: (arg: PassageProps) => void;
  
  // Display settings
  ctxScaleValue: number;
  ctxIsHebrew: boolean;
  ctxInViewMode: boolean;
  
  // Selection state
  ctxSelectedWords: WordProps[];
  ctxSetSelectedWords: (arg: WordProps[]) => void;
  ctxNumSelectedWords: number;
  ctxSetNumSelectedWords: (arg: number) => void;
  ctxSelectedStrophes: StropheProps[];
  ctxSetSelectedStrophes: (arg: StropheProps[]) => void;
  ctxNumSelectedStrophes: number;
  ctxSetNumSelectedStrophes: (arg: number) => void;
  
  // Color and styling
  ctxColorAction: ColorActionType;
  ctxSelectedColor: string;
  ctxSetSelectedColor: (arg: string) => void;
  ctxColorFill: string;
  ctxSetColorFill: (arg: string) => void;
  ctxBorderColor: string;
  ctxSetBorderColor: (arg: string) => void;
  ctxTextColor: string;
  ctxSetTextColor: (arg: string) => void;
  ctxBoxDisplayStyle: BoxDisplayStyle;
  ctxIndentNum: number;
  ctxSetIndentNum: (arg: number) => void;
  
  // Structure and updates
  ctxStructureUpdateType: StructureUpdateType;
  ctxSetStructureUpdateType: (arg: StructureUpdateType) => void;
  ctxRootsColorMap: Map<number, ColorData>;
  ctxSetRootsColorMap: (arg: Map<number, ColorData>) => void;
  
  // History management
  ctxHistory: StudyMetadata[];
  ctxPointer: number;
  ctxSetPointer: (arg: number) => void;
  ctxAddToHistory: (arg: StudyMetadata) => void;
}

/**
 * Props for StudyPane component
 */
export interface StudyPaneProps {
  passageData: any; // PassageStaticData - keeping as any to avoid import issues
  content: any; // PassageData - to be deprecated
  inViewMode: boolean;
}
