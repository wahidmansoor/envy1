# Project Structure Guide

This guide explains the project structure in a simple, hierarchical way. It's organized to help both technical and non-technical users understand where things are located and how they relate to each other.

---

## 1. Navigation
The project is organized into main sections, each serving a specific purpose. Here's how you can navigate through the project:

- **Root Directory**: Contains the main configuration files and top-level directories.
- **Server**: Holds backend-related code and configurations.
- **Src**: Contains the frontend application code.
- **Supabase**: Stores database migration files.

---

## 2. Headings
The main headings in the project structure are:

1. **Root Directory**
2. **Server Directory**
3. **Src Directory**
4. **Supabase Directory**

---

## 3. Subheadings
### 1. Root Directory
The root directory contains essential configuration files and top-level directories. Key files include:
- `.env`: Environment variables.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `vite.config.ts`: Frontend build configuration.

### 2. Server Directory
The server directory contains backend-related code:
- `index.js`: Main server file.
- `routes/`: API endpoints.
- `services/`: Business logic and utilities.
- `middleware/`: Express middleware.

### 3. Src Directory
The src directory contains the frontend application code:
- **Components**: UI elements organized by feature.
- **Hooks**: Custom React hooks.
- **Services**: Business logic and API integrations.
- **Types**: TypeScript type definitions.
- **Styles**: CSS and styling components.

### 4. Supabase Directory
The supabase directory contains database migration files:
- `migrations/`: SQL files for database schema changes.

---

## 4. Sub-Subheadings
### Components
Components are organized by feature:
- **Chat**: Chat-related components.
- **Chemo**: Chemotherapy-related components.
- **Flashcards**: Flashcard-related components.
- **Handbook**: Handbook-related components.
- **Inpatient**: Inpatient-related components.
- **OPD**: Outpatient-related components.
- **Palliative**: Palliative care-related components.
- **Tools**: Tool-related components.
- **UI**: UI primitives and utilities.

### Services
Services are organized by functionality:
- **AI**: AI-related services.
- **Calculators**: Calculation utilities.
- **Protocols**: Protocol management.

---

## 5. Main Content
### How to Modify or Add to the Project
1. **Adding New Components**:
   - Place new UI elements in the appropriate subdirectory under `src/components/`.
   - Follow existing naming conventions.

2. **Updating Services**:
   - Modify or add new service files in `src/services/`.
   - Update corresponding components to use the new services.

3. **Documentation**:
   - Add comments in code where complex logic exists.
   - Update this guide when adding new components or features.

4. **Style Updates**:
   - Modify CSS in `src/styles/`.
   - Add new style files for new components.

---

## Conclusion
This guide provides a clear overview of the project structure. By following the hierarchy and organization, you can easily navigate and modify the project. If you're unsure about where to place something, refer to similar files or ask for clarification.
