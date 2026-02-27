# Design: Indians in Richmond BC - UI/UX Redesign

**Date**: 2026-02-26
**Status**: Approved

## Overview
Redesign the Indians in Richmond BC community directory with a professional, corporate aesthetic featuring card-based layout, search functionality, and mobile responsiveness.

## Goals
- Improve mobile experience (current table is unusable on mobile)
- Professional look suitable for business directory
- Easy search/filter for users
- Better visual hierarchy

## UI/UX Specification

### Color Scheme
- **Primary**: Navy Blue `#1a365d` (header, buttons)
- **Background**: Light Gray `#f7fafc`
- **Cards**: White `#ffffff`
- **Accent**: Orange `#ed8936` (CTAs, highlights)
- **Text Primary**: Dark Gray `#2d3748`
- **Text Muted**: Gray `#718096`
- **Category Badges**: Various colors per category

### Typography
- **Headings**: System sans-serif, bold, `#1a365d`
- **Body**: System sans-serif, `#2d3748`
- **Card Title**: 18px, bold
- **Card Details**: 14px, regular

### Layout

#### Desktop (1024px+)
- Header: Logo + title + "Add Listing" button
- Search bar: Full width, prominent
- Category filter: Horizontal pills
- Grid: 3 columns of cards

#### Tablet (768px - 1023px)
- Grid: 2 columns of cards

#### Mobile (< 768px)
- Grid: 1 column of cards
- Collapsible category filter

### Components

#### Search Bar
- Placeholder: "Search businesses..."
- Instant filtering as user types
- Searches: name, category, contact info

#### Category Filter Pills
- Horizontal scrollable on mobile
- "All" selected by default
- Categories: Dentist, Education, Garage Coating, Gurdwara, Handyman, Insurance, Movers, Painter, Rentals, Realtor, Restaurant, RV Rentals, Sports, Temple, Grocery

#### Business Card
- White background with subtle shadow
- Rounded corners (8px)
- Hover: lift effect (shadow increases)
- Contents:
  - Business name (bold)
  - Category badge (color-coded)
  - Phone number with click-to-call
  - Email link (if available)
  - Website link (if available)
  - Address/Map link (add Google Maps link)

### Animations
- Card hover: transform translateY(-2px), shadow increase
- Filter transition: fade in/out (200ms)
- Search: instant filter (no debounce needed for ~30 items)

## Functionality

### Search
- Case-insensitive
- Matches: name, category, phone, email
- Updates on every keystroke

### Category Filter
- Single select (one category at a time)
- "All" shows everything
- Combines with search (AND logic)

### Sorting
- A-Z by name (default)
- Could add toggle later

## Data Structure
Business entries remain in index.md but parsed into card format. Each entry includes:
- Name
- Category
- Phone (tel: link)
- Email (mailto: link)
- Website
- Map/Address (optional)

## Acceptance Criteria
1. Page loads without errors
2. Cards display correctly on desktop (3 columns)
3. Cards display correctly on tablet (2 columns)
4. Cards display correctly on mobile (1 column)
5. Search filters results instantly
6. Category pills filter correctly
7. All phone numbers are clickable (tel: links)
8. All email addresses are clickable (mailto: links)
9. External website links open in new tab
10. Visual design looks professional and corporate

## Timeline
- Design: 5 min (this doc)
- Implementation: ~40 min
- Testing: ~10 min
- Total: ~55 min
