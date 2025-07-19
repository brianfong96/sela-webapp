// Main component export
export { default } from './index';

// Context and types exports for external usage
export { FormatContext } from './context';
export type { FormatContextType } from './types';

// Constants exports
export {
  DEFAULT_SCALE_VALUE,
  DEFAULT_COLOR_FILL,
  DEFAULT_BORDER_COLOR,
  DEFAULT_TEXT_COLOR
} from './constants';

// Hook exports for potential reuse
export {
  usePassageState,
  useSelectionState,
  useColorState,
  useUIState,
  useHistoryState
} from './hooks';

// Utility exports
export { convertContentToStudyMetadata } from './dataConversion';
