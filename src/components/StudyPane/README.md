# StudyPane Component - Refactored Architecture

This directory contains the refactored StudyPane component, broken down into modular, maintainable, and scalable pieces.

## Architecture Overview

### Files Structure

```
StudyPane/
├── index.tsx                    # Main component (orchestrator)
├── constants.ts                 # Shared constants
├── types.ts                     # TypeScript type definitions
├── context.ts                   # React context definition
├── hooks.ts                     # Custom hooks for state management
├── FormatContextProvider.tsx    # Context provider component
├── StudyPaneLayout.tsx         # Layout/presentation component
├── dataConversion.ts           # Data transformation utilities
├── useDataInitialization.ts    # Data initialization hook
├── exports.ts                  # Clean exports for external usage
└── README.md                   # This file
```

### Key Improvements

1. **Separation of Concerns**: Each file has a single, well-defined responsibility
2. **Custom Hooks**: State management is extracted into reusable hooks
3. **Type Safety**: Comprehensive TypeScript interfaces and types
4. **Data Layer**: Isolated data conversion and initialization logic
5. **Layout Separation**: UI layout is separated from business logic
6. **Context Management**: Centralized context provider for shared state

### Component Breakdown

#### `index.tsx` - Main Orchestrator
- Coordinates all state hooks
- Assembles context value
- Renders the layout with proper data flow

#### `hooks.ts` - State Management
- `usePassageState`: Manages passage and study metadata
- `useSelectionState`: Handles word and strophe selection
- `useColorState`: Manages color and styling options
- `useUIState`: Controls UI state (modals, panes, etc.)
- `useHistoryState`: Handles undo/redo functionality

#### `StudyPaneLayout.tsx` - Presentation Layer
- Pure presentation component
- Handles visual layout and structure
- Receives all necessary props from the main component

#### `dataConversion.ts` - Data Utilities
- Converts legacy PassageData to StudyMetadata format
- Handles complex data transformations
- Maintains data migration logic

#### `useDataInitialization.ts` - Initialization Logic
- Manages data merging and initialization
- Handles legacy data migration
- Side effect management for data setup

### Benefits

1. **Maintainability**: Each piece can be modified independently
2. **Testability**: Smaller, focused functions are easier to test
3. **Reusability**: Hooks and utilities can be reused elsewhere
4. **Scalability**: Easy to add new features without affecting existing code
5. **Type Safety**: Comprehensive typing prevents runtime errors
6. **Performance**: Better separation allows for more targeted optimizations

### Usage

```typescript
import StudyPane from '@/components/StudyPane';
// or
import StudyPane, { FormatContext, usePassageState } from '@/components/StudyPane';
```

### Migration Notes

- The external API remains the same - existing usage should work unchanged
- All exports are maintained for backward compatibility
- The context structure is preserved but now properly typed
- Legacy data conversion is handled automatically

### Future Improvements

1. Consider implementing reducer pattern for complex state updates
2. Add error boundaries for better error handling
3. Implement proper loading states
4. Add comprehensive unit tests for each module
5. Consider using React Query for server state management
