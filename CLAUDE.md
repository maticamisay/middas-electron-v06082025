# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Middas Gestión, an Electron-based business management application built with React, TypeScript, and NeDB for local data storage. The application focuses on product inventory management with a clean UI using Tailwind CSS.

## Development Commands

- `npm start` - Start the application in development mode with Electron Forge
- `npm run package` - Package the application for distribution
- `npm run make` - Build distributable packages for current platform
- `npm run lint` - Run ESLint to check code quality

## Architecture

### Core Structure
- **Main Process** (`src/index.ts`): Electron main process with IPC handlers for database operations
- **Renderer Process** (`src/Main.tsx`, `src/App.tsx`): React application with routing via react-router-dom
- **Database Layer** (`src/database/productDb.ts`): NeDB-based local database for product management
- **IPC Bridge** (`src/preload.ts`): Secure communication bridge between main and renderer processes

### Data Flow
1. React components call `window.electronAPI` methods (defined in preload.ts)
2. IPC handlers in main process (src/index.ts) receive requests and interact with ProductDatabase
3. ProductDatabase (src/database/productDb.ts) performs NeDB operations and returns data
4. Results flow back through IPC to React components

### Key Components
- **ProductDashboard**: Main product management interface with CRUD operations, filtering, and statistics
- **NewProductPage/NewProductForm**: Dedicated product creation interface
- **UI Components** (`components/ui/`): Reusable Button, Card, Input, Modal, and Table components

### Database
- Uses `@seald-io/nedb` for local JSON-based storage
- Database file stored in Electron's userData directory as `products.db`
- Indexed fields: id (unique), name, category, barcode (sparse)
- Product schema includes: id, name, description, price, stock, category, barcode, supplier, minStock, timestamps

### Styling
- Tailwind CSS 4.1.11 with PostCSS configuration
- Custom CSS in `src/index.css` and compiled to `src/output.css`
- Middas branding and clean interface design

## TypeScript Configuration
- Product types defined in `src/types/product.ts`
- Electron type definitions in `src/types/electron.d.ts`
- Global window interface extended for electronAPI in preload.ts

## Build System
- Webpack configuration split across multiple files (webpack.*.config.ts)
- Electron Forge for packaging and distribution
- Supports building for Windows (Squirrel), macOS (ZIP), and Linux (DEB/RPM)