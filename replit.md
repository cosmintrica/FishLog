# Replit.md

## Overview

PescArt România is a comprehensive fishing records website focused on Romanian fishing spots and locations. The platform enables users to discover fishing locations, submit their catches, and compete in various leaderboards. Built as a full-stack web application with a modern React frontend and Express.js backend, it features an interactive map of Romania with fishing locations, user authentication, record submission, and comprehensive leaderboard systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a modern component-based architecture:
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized production builds

The application uses a single-page architecture with component-based organization under `client/src/components/` and page-level components in `client/src/pages/`.

### Backend Architecture
The backend implements a REST API using Express.js:
- **Framework**: Express.js with TypeScript
- **Architecture Pattern**: Route-based organization with centralized storage layer
- **Data Layer**: Abstracted storage interface (currently in-memory, designed for easy database integration)
- **API Design**: RESTful endpoints for authentication, fishing records, locations, and leaderboards
- **Development Setup**: Hot reloading with Vite integration in development mode

### Data Storage Solutions
**Current Implementation**: In-memory storage with interface abstraction
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts data operations
- **Future Database**: Configured for PostgreSQL with Drizzle ORM
- **Schema**: Well-defined database schema in `shared/schema.ts` using Drizzle with Zod validation
- **Migration Ready**: Drizzle configuration set up for easy migration to PostgreSQL

**Database Schema Design**:
- **Users**: Authentication and profile information
- **Fishing Records**: Catch details with location, species, weight, photos, and verification status
- **Fishing Locations**: Pre-populated Romanian fishing spots with coordinates and metadata

### Authentication and Authorization
**Simple Authentication System**:
- **Registration**: User account creation with email/username uniqueness validation
- **Login**: Basic email/password authentication
- **Session Management**: Client-side storage of user session data
- **Protected Actions**: Record submission requires authentication

**Security Considerations**: Current implementation uses basic authentication suitable for development/prototype phase.

### External Service Integrations

**Map Integration**:
- **Leaflet**: Interactive map library for displaying Romanian fishing locations
- **OpenStreetMap**: Tile provider for map rendering
- **Dynamic Loading**: Map libraries loaded on-demand for performance

**Romanian Geographic Data**:
- **Fishing Locations**: Comprehensive database of Romanian rivers, lakes, and ponds
- **County System**: Romanian județe (county) classification system
- **Fish Species**: Native Romanian fish species database with scientific names

**UI Component System**:
- **Radix UI**: Accessibility-first component primitives
- **shadcn/ui**: Pre-built component system for consistent design
- **Tailwind CSS**: Utility-first styling with custom design tokens

**Development Tools**:
- **Replit Integration**: Development environment optimization
- **TypeScript**: Full-stack type safety
- **Vite**: Modern build tooling with HMR
- **Drizzle Kit**: Database migration and management tools