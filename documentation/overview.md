# Quran Ayah Display Generator Documentation

This document provides a detailed breakdown of each file in the project, describing its purpose, necessity, and how it works.

## Configuration Files

### 1. `next-config.js`
**Purpose**: Configures the Next.js application settings.  
**Necessity**: Essential for setting up webpack, font handling, and i18n support.  
**How it works**: Exports a configuration object that defines React strict mode, webpack rules for font files, and internationalization settings with RTL language support.

### 2. `tsconfig.json`
**Purpose**: Configures TypeScript compiler options.  
**Necessity**: Enables TypeScript support with appropriate settings for a Next.js project.  
**How it works**: Defines compiler options like target ECMAScript version, module resolution, and which files to include/exclude from compilation.

### 3. `package.json`
**Purpose**: Defines project metadata and dependencies.  
**Necessity**: Required for npm/yarn to manage dependencies and scripts.  
**How it works**: Lists all dependencies (React, Next.js, html-to-image, jsPDF) and development dependencies, along with scripts for development, building, and deployment.

### 4. `postcss-config.js`
**Purpose**: Configures PostCSS for processing CSS.  
**Necessity**: Required for Tailwind CSS integration.  
**How it works**: Simple configuration that enables Tailwind CSS and Autoprefixer plugins.

### 5. `tailwind-config.js`
**Purpose**: Configures Tailwind CSS framework.  
**Necessity**: Customizes the Tailwind CSS utility framework for project-specific needs.  
**How it works**: Extends Tailwind's default theme with custom colors, font families, shadows, and RTL support. Also includes necessary plugins and content paths.

## Page Files

### 6. `pages/index.js`
**Purpose**: The main application page component.  
**Necessity**: Serves as the entry point and orchestrates the app's functionality.  
**How it works**: Manages global state (Quran data, selections, settings), renders the main layout with settings panel and preview area, and coordinates component interactions.

### 7. `pages/_app.tsx`
**Purpose**: Custom Next.js App component.  
**Necessity**: Enables global styles and metadata across all pages.  
**How it works**: Imports global styles and adds common head elements like viewport settings and meta tags.

## Component Files

### 8. `components/SettingsPanel.js`
**Purpose**: Provides the UI for all customization options.  
**Necessity**: Enables users to select Surah/Ayahs and customize display settings.  
**How it works**: Renders form controls for surah selection, ayah range, font settings, and styling options. Uses state management to handle user input and communicate changes to parent components.

### 9. `components/SurahMetadata.js`
**Purpose**: Displays information about the selected Surah.  
**Necessity**: Provides context and educational information about Quranic content.  
**How it works**: Renders collapsible panel with relevant Surah information (revelation type, themes, etc.). Uses an internal database of Surah information with fallbacks for missing data.

### 10. `components/AyahNumber.js`
**Purpose**: Specialized component for rendering Ayah numbers.  
**Necessity**: Provides culturally appropriate styling for Quranic verse numbers.  
**How it works**: Supports multiple display styles (traditional, simple, minimalist) with proper locale conversion for Arabic numerals.

### 11. `components/FontLoader.js`
**Purpose**: Manages loading of specialized Quranic fonts.  
**Necessity**: Ensures proper rendering of Arabic text with specialized fonts.  
**How it works**: Uses Next.js Head component to inject font loading styles and scripts, with progressive enhancement for font loading detection.

### 12. `components/FontSelector.js`
**Purpose**: UI for selecting and previewing Quranic fonts.  
**Necessity**: Allows users to choose appropriate fonts with visual feedback.  
**How it works**: Displays font samples with detailed information about each font's characteristics and appropriateness for Quranic text.

### 13. `components/ExportFormats.js`
**Purpose**: Advanced export configuration UI.  
**Necessity**: Enables detailed customization of export options.  
**How it works**: Provides UI for selecting export format and configuring advanced settings like quality, margins, and metadata inclusion. Handles export generation through utility functions.

### 14. `components/ExportOptions.js`
**Purpose**: Simple export button interface.  
**Necessity**: Provides quick access to basic export functionality.  
**How it works**: Renders export buttons for PNG, SVG, and PDF formats with loading states and status messages. Uses utility functions to handle the actual export process.

### 15. `components/QuranSpecialFeatures.js`
**Purpose**: Manages special Quranic text features.  
**Necessity**: Handles culturally important elements like bismillah and sajdah marks.  
**How it works**: Provides controls for enabling/disabling special features and rendering previews with appropriate styling.

### 16. `components/QuranTextDisplay.js`
**Purpose**: Core component for rendering Quranic text.  
**Necessity**: Handles the actual text display with proper styling.  
**How it works**: Applies font, color, and layout settings to Quranic text with special handling for ayah numbers. Uses refs and effects to handle font loading transitions.

### 17. `components/RTLTextContainer.js`
**Purpose**: Specialized container for right-to-left text.  
**Necessity**: Ensures proper rendering of Arabic text direction.  
**How it works**: Sets appropriate HTML attributes (dir="rtl", lang="ar") and CSS properties for optimal Arabic text rendering with bidirectional text support.

## Utility Files

### 18. `utils/apiUtils.js`
**Purpose**: Handles integration with external Quran APIs.  
**Necessity**: Enables fetching Quranic text from established APIs.  
**How it works**: Provides functions for fetching complete Quran data, specific surahs, or ayah ranges from external APIs (AlQuran.cloud, Quran.com) with response transformation and fallback mechanisms.

### 19. `utils/quranUtils.js`
**Purpose**: Core utilities for Quran data handling.  
**Necessity**: Centralizes common functions for data retrieval and manipulation.  
**How it works**: Provides functions for fetching Quran data, accessing specific surahs/ayahs, export functionality (PNG, SVG, PDF), font management, and styling helpers.

## Style Files

### 20. `styles/globals.css`
**Purpose**: Global CSS styles.  
**Necessity**: Provides base styling and Tailwind CSS imports.  
**How it works**: Imports Tailwind CSS utilities, defines custom font faces, and adds specialized styling for Arabic text and form controls.

## Data Files

### 21. `public/fonts/fonts.json`
**Purpose**: Configuration file for available Quranic fonts.  
**Necessity**: Enables dynamic font selection without hardcoding.  
**How it works**: JSON array of font objects with metadata about each font (name, file path, label).

## Documentation Files

### 22. `documentation/readme-file.md`
**Purpose**: Project README documentation.  
**Necessity**: Provides overall project information and setup instructions.  
**How it works**: Markdown document detailing features, installation, project structure, usage, cultural considerations, API integration, and other project information.

### 23. `documentation/fonts.md`
**Purpose**: Documentation for font integration.  
**Necessity**: Guides developers on adding new Quranic fonts.  
**How it works**: Step-by-step instructions for adding new font files, updating configuration, and registering fonts in CSS.

## Architectural Overview

The application follows a component-based architecture with clear separation of concerns:

1. **Core Components**: Handle the main UI and functionality
   - `pages/index.js` orchestrates overall application flow
   - `SettingsPanel.js` manages user input
   - `QuranTextDisplay.js` renders the output

2. **Specialized Components**: Handle specific aspects of Quranic text
   - `RTLTextContainer.js` for right-to-left text
   - `AyahNumber.js` for verse numbering
   - `FontLoader.js` for specialized fonts

3. **Utility Layer**: Provides reusable functions
   - `quranUtils.js` for core functionality
   - `apiUtils.js` for external data fetching

4. **Data Flow**:
   - User selections in `SettingsPanel.js` update state in `index.js`
   - Updated state flows down to `QuranTextDisplay.js` for rendering
   - Export functions in utility layer handle output generation

This architecture ensures maintainability, separation of concerns, and flexibility for future enhancements while respecting the cultural and religious considerations of Quranic text handling.