# Project Index

This index provides a comprehensive overview of the project structure and guidance on how to modify, document, or edit specific areas.

## Main Directories

### `src/` - Core Application Code
- Contains the main application components and logic
- Key subdirectories:
  - `components/`: UI components organized by feature
  - `hooks/`: Custom React hooks
  - `services/`: Business logic and API integrations
  - `types/`: TypeScript type definitions
  - `styles/`: CSS and styling components

### `server/` - Backend Services
- Contains the server-side logic and API endpoints
- Key subdirectories:
  - `routes/`: API route handlers
  - `services/`: Backend services and utilities
  - `middleware/`: Express middleware

### `supabase/` - Database Migrations
- Contains database schema and migration files
- Key subdirectories:
  - `migrations/`: SQL migration files

### `data/` - Static Data Files
- Contains static data used by the application
- Key subdirectories:
  - `cancer-types/`: Cancer type specific data

### `constants/` - Configuration Files
- Contains application-wide constants and configurations

### `lib/` - Utility Libraries
- Contains reusable utility functions

## Component Structure

### `src/components/`
- Contains UI components organized by feature
- Key subdirectories:
  - `chat/`: Chat-related components
  - `chemo/`: Chemotherapy-related components
  - `flashcards/`: Flashcard-related components
  - `handbook/`: Handbook-related components
  - `inpatient/`: Inpatient-related components
  - `opd/`: Outpatient-related components
  - `palliative/`: Palliative care-related components
  - `tools/`: Tool-related components
  - `ui/`: UI primitives and utilities

## Services

### `src/services/`
- Contains business logic and API integrations
- Key subdirectories:
  - `ai/`: AI-related services
  - `calculators/`: Calculation utilities
  - `protocols/`: Protocol management

## Hooks

### `src/hooks/`
- Contains custom React hooks
- Key files:
  - `useFlashcards.ts`: Flashcard hook
  - `useProtocols.ts`: Protocol hook
  - `useQuickNotes.ts`: Quick notes hook
  - `useUploadForm.ts`: Upload form hook

## Documentation

### Adding/Modifying Documentation
1. **Component Documentation**:
   - Add new components to `src/components/` directory
   - Follow existing patterns and naming conventions
2. **Service Documentation**:
   - Update `src/services/` for new business logic
   - Add new service files as needed
3. **Data Documentation**:
   - Modify static data in `src/data/`
   - Add new data files as needed
4. **Style Documentation**:
   - Update CSS in `src/styles/`
   - Add new style files for new components

### Editing Existing Code
- **Components**: Modify files in `src/components/`
- **Services**: Update logic in `src/services/`
- **Hooks**: Modify hooks in `src/hooks/`
- **Data**: Update static data in `src/data/`
- **Styles**: Modify CSS in `src/styles/`

## Contributing

1. **Adding New Features**:
   - Create new components in `src/components/`
   - Add corresponding service logic in `src/services/`
   - Update types in `src/types/` as needed

2. **Modifying Existing Features**:
   - Update components in `src/components/`
   - Modify services in `src/services/`
   - Update hooks in `src/hooks/` if needed

3. **Documentation**:
   - Add comments in code where complex logic exists
   - Update this index file when adding new components or features
