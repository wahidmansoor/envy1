# Data Documentation for OncoAssist Web App

This document provides a comprehensive overview of the location and structure of all data used in the OncoAssist web application. It also includes instructions on how to manually alter or amend the data if needed.

## 1. Protocols Data

### Location

-   **File:** `src/services/protocols/protocols.service.ts`
-   **Database Table:** `protocols` (in Supabase)

### Structure

The `protocols` table contains the following columns:

-   `id` (uuid, primary key)
-   `code` (text, unique) - Protocol code
-   `tumour_group` (text) - Tumour group the protocol belongs to
-   `eligibility` (text[]) - Eligibility criteria for the protocol
-   `exclusions` (text[]) - Exclusion criteria for the protocol
-   `tests` (jsonb) - Required tests at different stages
    -   `Baseline` (text[])
    -   `Before each treatment` (text[])
    -   `Weekly` (text[]) - Optional
    -   `If clinically indicated` (text[]) - Optional
-   `treatment` (text[]) - Treatment steps
-   `dose_modifications` (jsonb) - Dose modification guidelines
    -   `Hematological`
        -   `ANC (10⁹/L)` (text[])
        -   `Platelets (10⁹/L)` (text[])
        -   `Dose` (text[])
    -   OR
        -   `Based on day 1 counts`
            -   `ANC (x10^9/L)` (text)
            -   `Platelets (x10^9/L)` (text)
            -   `Dose` (text)
        -   `Based on nadir counts for pemetrexed only`
            -   `ANC (x10^9/L)` (text)
            -   `Platelets (x10^9/L)` (text)
            -   `Dose` (text)
-   `precautions` (text[]) - Precautions for the protocol
-   `reference_list` (text[]) - List of references
-   `created_at` (timestamptz) - Timestamp of record creation
-   `updated_at` (timestamptz) - Timestamp of last update

### Data Retrieval

The `getProtocols()` function in `src/services/protocols/protocols.service.ts` fetches all protocols from the `protocols` table using the Supabase client.

The `getProtocolByCode(code: string)` function fetches a specific protocol by its code.

### Manual Alteration

To manually alter or amend the protocols data:

1. **Directly in Supabase:**
    -   Log in to your Supabase project.
    -   Navigate to the `Tables` section and select the `protocols` table.
    -   You can directly insert, update, or delete rows in the table.
    -   Ensure that any changes made directly in the database adhere to the defined schema and data types.

2. **Via Code:**
    -   Modify the `protocols` data in the `supabase/migrations` directory.
    -   Create new migration files to insert, update, or delete data as needed.
    -   Run the migrations using the Supabase CLI: `supabase db push`
    -   Update the `getProtocols()` and `getProtocolByCode()` functions in `src/services/protocols/protocols.service.ts` if necessary to reflect any changes in data structure or retrieval logic.

## 2. Calculator Data

### Location

-   **File:** `src/constants/calculators.ts`

### Structure

The `calculatorCategories` array defines the categories and calculators available in the app. Each category has the following structure:

-   `id` (string) - Unique identifier for the category
-   `name` (string) - Display name of the category
-   `description` (string) - Brief description of the category
-   `calculators` (Calculator[]) - Array of calculators in the category

Each `Calculator` object has the following structure:

-   `id` (string) - Unique identifier for the calculator
-   `name` (string) - Display name of the calculator
-   `description` (string) - Brief description of the calculator
-   `inputs` (CalculatorInput[]) - Array of input fields for the calculator
-   `interpretation?` ((result: string) =&gt; string) - Optional function to interpret the result

Each `CalculatorInput` object has the following structure:

-   `id` (string) - Unique identifier for the input
-   `label` (string) - Display label for the input
-   `type` ('number' | 'select' | 'text') - Type of input field
-   `required?` (boolean) - Whether the input is required
-   `min?` (number) - Minimum value (for number inputs)
-   `max?` (number) - Maximum value (for number inputs)
-   `step?` (number) - Step value (for number inputs)
-   `options?` (Array&lt;{ label: string; value: string }&gt;) - Options for select inputs
-   `hint?` (string) - Hint text for the input

### Manual Alteration

To add, modify, or remove calculators:

1. Edit the `calculatorCategories` array in `src/constants/calculators.ts`.
2. For new calculators, define the `Calculator` object with its inputs and calculation logic.
3. For existing calculators, modify the properties as needed.
4. To remove a calculator, delete its corresponding object from the `calculators` array.
5. Update the calculation logic in `src/services/calculators/index.ts` if necessary.

## 3. Flashcard Data

### Location

-   **File:** `src/constants/flashcards.ts`

### Structure

The `flashcardsData` array contains the data for all flashcards. Each flashcard has the following structure:

-   `id` (string) - Unique identifier for the flashcard
-   `moduleId` (FlashcardModule) - Module the flashcard belongs to ('Basics' | 'Diagnosis' | 'Treatment' | 'Complications' | 'Research')
-   `question` (string) - Question displayed on the front of the card
-   `answer` (string) - Answer displayed on the back of the card
-   `tags` (string[]) - Tags associated with the flashcard
-   `difficulty` (FlashcardDifficulty) - Difficulty level ('Basic' | 'Intermediate' | 'Advanced')

### Manual Alteration

To add, modify, or remove flashcards:

1. Edit the `flashcardsData` array in `src/constants/flashcards.ts`.
2. For new flashcards, define a new object with the required properties.
3. For existing flashcards, modify the properties as needed.
4. To remove a flashcard, delete its corresponding object from the array.

## 4. Document Upload Data

### Location

-   **Database Table:** `documents` (in Supabase)

### Structure

The `documents` table contains the following columns:

-   `id` (uuid, primary key) - Unique identifier for the document
-   `title` (text) - Title of the document
-   `content` (text) - Content of the document (after processing)
-   `embedding` (vector) - Vector embedding of the document content
-   `created_at` (timestamptz) - Timestamp of document creation
-   `user_id` (uuid, foreign key) - ID of the user who uploaded the document

### Manual Alteration

To manually alter document data:

1. **Directly in Supabase:**
    -   Log in to your Supabase project.
    -   Navigate to the `Tables` section and select the `documents` table.
    -   You can directly insert, update, or delete rows in the table.
    -   Note that modifying `content` or `embedding` directly might have implications for the RAG system.

2. **Via Code:**
    -   You can create scripts to interact with the Supabase client and modify data in the `documents` table.
    -   Ensure that any changes made programmatically adhere to the defined schema and data types.

## 5. Quick Notes Data

### Location

-   **Browser's Local Storage:** `localStorage`
-   **Key:** `'quickNotes'`

### Structure

The quick notes data is stored as a single string in the browser's local storage. The string can contain HTML formatting.

### Manual Alteration

To manually alter quick notes data:

1. **Using Browser Developer Tools:**
    -   Open your browser's developer tools (usually by pressing F12).
    -   Go to the `Application` or `Storage` tab.
    -   Find the `Local Storage` section and select your app's domain.
    -   Locate the `'quickNotes'` key and modify its value directly.

2. **Via Code:**
    -   You can use JavaScript to interact with `localStorage` and modify the `'quickNotes'` value.
    -   For example: `localStorage.setItem('quickNotes', 'New content')`

## 6. User Authentication Data

### Location

-   **Supabase Authentication**

### Structure

User authentication data is managed by Supabase Authentication and includes:

-   User ID
-   Email
-   Password (hashed and salted)
-   Metadata (e.g., name, avatar URL)

### Manual Alteration

To manage user authentication data:

1. **Supabase Dashboard:**
    -   Log in to your Supabase project.
    -   Navigate to the `Authentication` section.
    -   You can view, modify, or delete user accounts here.

2. **Supabase Client:**
    -   Use the Supabase client library to interact with the authentication API.
    -   Refer to the Supabase documentation for details on user management functions.

## 7. Environment Variables

### Location

-   **File:** `.env` (in the root directory)

### Structure

The `.env` file contains environment variables used by the application. Key variables include:

-   `VITE_GEMINI_API_KEY` - API key for Google Gemini
-   `VITE_SUPABASE_ANON_KEY` - Anonymous key for Supabase
-   `VITE_SUPABASE_URL` - URL of your Supabase project
-   `VITE_API_URL` - Base URL for your backend API

### Manual Alteration

To modify environment variables:

1. Edit the `.env` file directly.
2. Restart your development server or rebuild your application for the changes to take effect.
3. For production, you'll need to update the environment variables in your hosting environment (e.g., Vercel, Netlify, AWS).

## 8. Static Assets

### Location

-   Images: `public/`
-   Favicon: `public/favicon.ico`
-   Other static files: `public/`

### Structure

Static assets are stored in the `public` directory and are served directly by the web server.

### Manual Alteration

To add, modify, or remove static assets:

1. Place the files in the `public` directory.
2. Reference them in your code using absolute paths (e.g., `/image.jpg`).
3. To remove an asset, delete it from the `public` directory.

## 9. Source Code

### Location

-   **Frontend:** `src/`
-   **Backend:** `server/`

### Structure

The source code is organized into modules and components. Refer to the `README.md` file and the code itself for detailed documentation.

### Manual Alteration

To modify the source code:

1. Edit the relevant files in the `src` or `server` directories.
2. Follow the existing code style and conventions.
3. Test your changes thoroughly before deploying.

## 10. Dependencies

### Location

-   **Frontend:** `package.json` (in the root directory)
-   **Backend:** `server/package.json`

### Structure

Dependencies are managed using npm. The `package.json` files list the dependencies and their versions.

### Manual Alteration

To add, update, or remove dependencies:

1. Use npm commands:
    -   `npm install <package-name>` to add a new dependency
    -   `npm update <package-name>` to update a dependency
    -   `npm uninstall <package-name>` to remove a dependency
2. Alternatively, you can manually edit the `package.json` file and then run `npm install` to update the installed packages.

## 11. Build and Deployment

### Build Process

The frontend application is built using Vite. The build process compiles the TypeScript code, bundles the modules, optimizes assets, and generates the production-ready files in the `dist` directory.

### Deployment

The built application can be deployed to any static hosting service (e.g., Vercel, Netlify, AWS S3). The backend API can be deployed to a Node.js hosting environment (e.g., Heroku, AWS EC2, DigitalOcean).

### Manual Alteration

To customize the build process:

1. Modify the `vite.config.ts` file for frontend build configurations.
2. Modify the `server/index.js` file for backend configurations.
3. Refer to the Vite and Node.js documentation for advanced configuration options.

## 12. Database Migrations

### Location

-   **Directory:** `supabase/migrations`

### Structure

Database migrations are SQL scripts that define changes to the database schema. Each migration file is named with a timestamp prefix to ensure they are applied in the correct order.

### Manual Alteration

To create or modify database migrations:

1. Use the Supabase CLI:
    -   `supabase migration new <migration-name>` to create a new migration file.
    -   Edit the generated SQL file in the `supabase/migrations` directory.
2. Apply migrations:
    -   `supabase db push` to apply migrations to the remote database.
    -   `supabase db reset` to reset the local database and apply migrations.

## 13. Security

### Authentication

User authentication is handled by Supabase Authentication. API keys and JWT secrets are stored as environment variables.

### Authorization

Row Level Security (RLS) policies are defined in the database migrations to control access to data based on user roles and ownership.

### Data Validation

Input validation is performed both on the frontend (using form validation) and on the backend (using validation logic in API routes) to prevent invalid or malicious data from being stored.

### Manual Alteration

To modify security settings:

1. Update RLS policies in the database migration files.
2. Modify authentication logic in the frontend and backend code.
3. Adjust data validation rules as needed.

## 14. Logging and Monitoring

### Logging

The backend API uses `console.log` for basic logging. For production, consider integrating a more robust logging solution like Winston or Pino.

### Monitoring

Supabase provides basic monitoring of database usage and performance. For more advanced monitoring, you can integrate third-party services like Datadog or Prometheus.

### Manual Alteration

To customize logging and monitoring:

1. Modify the logging statements in the backend code.
2. Integrate third-party monitoring services by adding the necessary code and configurations.

## 15. Testing

### Unit Tests

Unit tests are written using Vitest and are located in `*.test.ts` files alongside the code they are testing.

### Integration Tests

Integration tests can be added to test the interaction between different modules or services.

### End-to-End Tests

End-to-end tests can be implemented using tools like Cypress or Playwright to test the entire application flow.

### Manual Alteration

To add or modify tests:

1. Create or edit `*.test.ts` files for unit tests.
2. Implement integration or end-to-end tests using your preferred testing framework.
3. Run tests using `npm run test`.

## 16. Internationalization

### Location

-   **Directory:** `src/locales` (not currently implemented)

### Structure

Internationalization (i18n) can be implemented using a library like `react-i18next`. Translations would be stored in JSON or YAML files in the `src/locales` directory.

### Manual Alteration

To add or modify translations:

1. Create or edit translation files in the `src/locales` directory.
2. Use the i18n library's functions to load and display translated strings in your components.

## 17. Accessibility

### Guidelines

The application aims to follow WCAG (Web Content Accessibility Guidelines) to ensure accessibility for users with disabilities.

### Manual Alteration

To improve accessibility:

1. Use semantic HTML elements.
2. Provide text alternatives for non-text content (e.g., alt text for images).
3. Ensure keyboard navigability.
4. Use sufficient color contrast.
5. Test with assistive technologies (e.g., screen readers).

## 18. Performance Optimization

### Techniques

-   Code splitting
-   Lazy loading
-   Image optimization
-   Caching
-   Database indexing

### Manual Alteration

To optimize performance:

1. Analyze performance using browser developer tools or profiling tools.
2. Implement code changes to address bottlenecks.
3. Configure caching headers on the server or CDN.
4. Optimize database queries and add indexes if needed.

## 19. Error Handling

### Frontend

Error boundaries are used to catch JavaScript errors in components and prevent the entire application from crashing.

### Backend

API routes use try-catch blocks to handle errors and return appropriate error responses.

### Manual Alteration

To improve error handling:

1. Add error boundaries to components where necessary.
2. Implement more specific error handling logic in API routes.
3. Log errors to a monitoring service for analysis.

## 20. Code Style and Conventions

### Style Guide

The project follows the Airbnb JavaScript style guide with some modifications.

### Linting

ESLint is used to enforce code style and identify potential errors.

### Formatting

Prettier is used to automatically format code.

### Manual Alteration

To modify code style or linting rules:

1. Edit the `.eslintrc.js` and `prettier.config.js` files.
2. Run `npm run lint` to check for linting errors.
3. Run `npm run format` to automatically format code.

## 21. Version Control

### Git

The project uses Git for version control. The main branch is `main`, and feature branches are used for new development.

### GitHub

The project is hosted on GitHub, and pull requests are used for code review.

### Manual Alteration

To manage version control:

1. Follow standard Git workflows for branching, committing, and merging.
2. Use GitHub's features for issue tracking, pull requests, and project management.

## 22. Documentation

### README

The `README.md` file in the root directory provides an overview of the project, setup instructions, and other important information.

### Code Comments

Code comments are used to explain complex logic or non-obvious code.

### This Document

This `DATA_DOCUMENTATION.md` file provides detailed information about the location and structure of data in the application.

### Manual Alteration

To update documentation:

1. Edit the `README.md` or other markdown files.
2. Add or modify code comments as needed.
3. Ensure that documentation is kept up-to-date with any code changes.

## 23. Modules: Location and Modification of Written Material

This section details the location of written content within each module and its submodules, along with instructions on how to modify, add, or amend the content.

### AI Handbook

**Location:** `src/components/handbook/AIHandbookModule.tsx`

**Submodules:**

-   **Clinical Guidelines:**
    -   **Location:** `src/components/handbook/guidelines/ClinicalGuidelines.tsx`
    -   **Content:** `guidelines` array within the `ClinicalGuidelines` component.
    -   **Modification:** Edit the `guidelines` array to add, remove, or modify guidelines. Each guideline object includes `title`, `category`, `lastUpdated`, `recommendations`, and `evidenceLevel`.
-   **Treatment Algorithms:**
    -   **Location:** `src/components/handbook/algorithms/TreatmentAlgorithms.tsx`
    -   **Content:** `algorithms` array within the `TreatmentAlgorithms` component.
    -   **Modification:** Edit the `algorithms` array to add, remove, or modify algorithms. Each algorithm object includes `title`, `steps`, and `decisionPoints`.
-   **Evidence Library:**
    -   **Location:** `src/components/handbook/evidence/EvidenceLibrary.tsx`
    -   **Content:** `evidenceItems` array within the `EvidenceLibrary` component.
    -   **Modification:** Edit the `evidenceItems` array to add, remove, or modify evidence items. Each item includes `title`, `type`, `year`, `keyFindings`, and `implications`.
-   **Best Practices:**
    -   **Location:** `src/components/handbook/practices/BestPractices.tsx`
    -   **Content:** `practices` array within the `BestPractices` component.
    -   **Modification:** Edit the `practices` array to add, remove, or modify best practices. Each practice includes `title`, `category`, `recommendations`, and `rationale`.

### Oncology OPD

**Location:** `src/components/opd/OPDModule.tsx`

**Submodules:**

-   **Patient Evaluation:**
    -   **Location:** `src/components/opd/PatientEvaluation.tsx`
    -   **Content:** `evaluationSteps` array within the `PatientEvaluation` component.
    -   **Modification:** Edit the `evaluationSteps` array to add, remove, or modify steps. Each step includes `title` and `items`.
-   **Diagnostic Pathways:**
    -   **Location:** `src/components/opd/DiagnosticPathways.tsx`
    -   **Content:** `pathways` array within the `DiagnosticPathways` component.
    -   **Modification:** Edit the `pathways` array to add, remove, or modify pathways. Each pathway includes `title` and `steps`.
-   **Cancer Screening:**
    -   **Location:** `src/components/opd/CancerScreening.tsx`
    -   **Content:** `screeningGuidelines` array within the `CancerScreening` component.
    -   **Modification:** Edit the `screeningGuidelines` array to add, remove, or modify guidelines. Each guideline includes `cancer`, `population`, `frequency`, `method`, and `recommendations`.
-   **Referral Guidelines:**
    -   **Location:** `src/components/opd/ReferralGuidelines.tsx`
    -   **Content:** `referralGuidelines` array within the `ReferralGuidelines` component.
    -   **Modification:** Edit the `referralGuidelines` array to add, remove, or modify guidelines. Each guideline includes `condition`, `urgency`, `criteria`, and `workup`.

### Chemotherapy Unit

**Location:** `src/components/chemo/ChemoModule.tsx`

**Submodules:**

-   **Regimens Library:**
    -   **Location:** `src/components/chemo/RegimensLibrary.tsx`
    -   **Content:** Fetched from the `protocols` table in the database (see Section 1: Protocols Data).
    -   **Modification:** Modify protocol data in the database as described in Section 1.
-   **Toxicity Monitoring:**
    -   **Location:** `src/components/chemo/ToxicityMonitoring.tsx`
    -   **Content:** `toxicityData` array within the `ToxicityTable` component (`src/components/chemo/monitoring/ToxicityTable.tsx`).
    -   **Modification:** Edit the `toxicityData` array to add, remove, or modify toxicities. Each toxicity includes `category`, `toxicities` (with `name`, `monitoring`, `management`, and `grading`).
-   **Dose Calculator:**
    -   **Location:** `src/components/chemo/DoseCalculator.tsx`
    -   **Content:** Calculation logic and input fields are defined within the `DoseCalculator` component.
    -   **Modification:** Modify the calculation functions (`calculateBSA`, `calculateCarboplatinDose`) in `src/services/calculators/calculations.ts` and the input fields in `src/components/chemo/DoseCalculator.tsx`.
-   **Pre-Medications:**
    -   **Location:** `src/components/chemo/PreMedications.tsx`
    -   **Content:** `premedications` array within the `PreMedications` component.
    -   **Modification:** Edit the `premedications` array to add, remove, or modify premedication categories and medications. Each category includes `category` and `medications` (with `name`, `dose`, `timing`, and `indications`).

### Inpatient Oncology

**Location:** `src/components/inpatient/InpatientModule.tsx`

**Submodules:**

-   **Emergency Protocols:**
    -   **Location:** `src/components/inpatient/EmergencyProtocols.tsx`
    -   **Content:** `emergencies` array within the `EmergencyProtocols` component.
    -   **Modification:** Edit the `emergencies` array to add, remove, or modify emergencies. Each emergency includes `title`, `priority`, `symptoms`, `immediateActions`, and `monitoring`.
-   **Admission Guidelines:**
    -   **Location:** `src/components/inpatient/AdmissionGuidelines.tsx`
    -   **Content:** `criteria` array in `AdmissionCriteria` component (`src/components/inpatient/admission/AdmissionCriteria.tsx`) and `checklist` array in `AdmissionChecklist` component (`src/components/inpatient/admission/AdmissionChecklist.tsx`).
    -   **Modification:** Edit the `criteria` and `checklist` arrays to add, remove, or modify admission criteria and checklist items.
-   **Supportive Care:**
    -   **Location:** `src/components/inpatient/SupportiveCare.tsx`
    -   **Content:** `supportiveCare` array within the `SupportiveCare` component.
    -   **Modification:** Edit the `supportiveCare` array to add, remove, or modify supportive care categories. Each category includes `category`, `items`, and `recommendations`.
-   **Discharge Planning:**
    -   **Location:** `src/components/inpatient/DischargeChecklist.tsx`
    -   **Content:** `checklist` array within the `DischargeChecklist` component.
    -   **Modification:** Edit the `checklist` array to add, remove, or modify discharge checklist categories and items. Each category includes `category` and `items`.

### Palliative Care

**Location:** `src/components/palliative/PalliativeCareModule.tsx`

**Submodules:**

-   **Pain Management:**
    -   **Location:** `src/components/palliative/PainManagement.tsx`
    -   **Content:**
        -   `assessmentTools` array in `PainAssessment` component (`src/components/palliative/pain/PainAssessment.tsx`).
        -   `protocols` array in `PainProtocols` component (`src/components/palliative/pain/PainProtocols.tsx`).
        -   `guidelines` array in `BreakthroughPain` component (`src/components/palliative/pain/BreakthroughPain.tsx`).
    -   **Modification:** Edit the respective arrays to add, remove, or modify pain assessment tools, pain management protocols, and breakthrough pain guidelines.
-   **End of Life Care:**
    -   **Location:** `src/components/palliative/EndOfLifeCare.tsx`
    -   **Content:**
        -   `guidelines` object in `TerminalCare` component (`src/components/palliative/eol/TerminalCare.tsx`).
        -   `directives` object in `AdvanceDirectives` component (`src/components/palliative/eol/AdvanceDirectives.tsx`).
        -   `support` object in `FamilySupport` component (`src/components/palliative/eol/FamilySupport.tsx`).
    -   **Modification:** Edit the respective objects to add, remove, or modify terminal care guidelines, advance directives components, and family support items.
-   **Symptom Control:**
    -   **Location:** `src/components/palliative/SymptomControl.tsx`
    -   **Content:**
        -   `symptoms` object in `GastrointestinalSymptoms`, `RespiratorySymptoms`, and `NeurologicalSymptoms` components (`src/components/palliative/symptoms/`).
    -   **Modification:** Edit the `symptoms` object in each component to add, remove, or modify symptoms and their management strategies.
-   **Psychosocial Care:**
    -   **Location:** `src/components/palliative/PsychosocialCare.tsx`
    -   **Content:**
        -   `support` object in `PsychologicalSupport`, `SocialSupport`, and `SpiritualCare` components (`src/components/palliative/psychosocial/`).
    -   **Modification:** Edit the `support` object in each component to add, remove, or modify assessment, interventions, and support items.

## 24. Future Considerations

-   Implement a more robust data validation and sanitization strategy.
-   Consider using a GraphQL API for more flexible data fetching.
-   Add more comprehensive testing, including integration and end-to-end tests.
-   Implement internationalization to support multiple languages.
-   Continuously monitor and improve performance and accessibility.

This documentation provides a starting point for understanding and working with the data in the OncoAssist web application. It is important to keep this documentation up-to-date as the application evolves and new features are added.
