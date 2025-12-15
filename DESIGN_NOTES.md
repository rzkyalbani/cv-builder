# FlowCV Clone - Frontend Redesign

## Overview

This project has been redesigned with a focus on modern minimal UI/UX principles, using Radix UI as the foundation for all interactive components.

## Design Philosophy

### Principles
- **Calm & Readable**: Designed for long editing sessions
- **Structured**: Clear visual hierarchy throughout
- **Fatigue-free**: Generous whitespace and comfortable typography
- **Accessible**: Built on Radix UI primitives with full keyboard navigation

### Visual Design
- **Colors**: Neutral slate palette with minimal accent colors
- **Typography**: System font stack with clear hierarchy
- **Spacing**: Consistent spacing scale for visual rhythm
- **Components**: Clean, minimal designs without decorative excess

## Tech Stack

### Core
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication

### UI Components
- **Radix UI** - Accessible component primitives
  - Accordion (for collapsible editor sections)
  - Dialog (for modals)
  - Dropdown Menu (for actions)
  - Alert Dialog (for confirmations)
  - Scroll Area (for scrollable content)
  - Separator (for visual dividers)
  - Label (for form labels)

### Utilities
- **class-variance-authority** - Component variants
- **clsx** & **tailwind-merge** - Conditional styling
- **lucide-react** - Icon system

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/              # Radix UI wrapper components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   └── textarea.tsx
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── CreateResumeCard.tsx
│   │   │   └── ResumeCard.tsx
│   │   ├── editor/          # Editor components
│   │   │   ├── EditorSidebar.tsx
│   │   │   ├── ResumeEditorNew.tsx
│   │   │   └── forms/       # Section forms
│   │   ├── layout/          # Layout components
│   │   │   └── Navbar.tsx
│   │   └── preview/         # Preview components
│   │       └── ResumePreview.tsx
│   ├── dashboard/           # Dashboard page
│   ├── editor/              # Editor pages
│   └── (auth)/              # Authentication pages
├── lib/
│   └── utils.ts             # Utility functions (cn helper)
└── types/                   # TypeScript types
```

## Key Features

### Dashboard
- Clean grid layout for resume cards
- Dropdown menus for resume actions (edit, duplicate, delete)
- Alert dialogs for destructive actions
- Empty state with call-to-action
- Create new resume dialog with form validation

### CV Editor
- **Two-column layout**:
  - Left: Collapsible form sections (480px fixed width)
  - Right: Live preview (flexible width)
- **Radix Accordion** for editor sections:
  - Personal Details
  - Experience
  - Education
  - Skills
  - Projects
  - Custom Sections
- Smooth animations for expand/collapse
- Auto-save functionality
- PDF download capability

### CV Preview
- Print-friendly design
- A4 dimensions (210mm × 297mm)
- Clean typography hierarchy
- Minimal styling for professional look
- Optimized for export

### Authentication
- Clean login/register forms
- Form validation
- Error handling
- Consistent with overall design

## Component Library

All UI components are built on Radix UI and follow these patterns:

### Button
```tsx
<Button variant="default" size="default">Click me</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost</Button>
```

### Input & Label
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

### Accordion
```tsx
<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section Title</AccordionTrigger>
    <AccordionContent>
      {/* Content */}
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

## Development

### Setup
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## Design Decisions

### Why Radix UI?
- **Accessibility**: WCAG compliant out of the box
- **Composability**: Flexible, unstyled primitives
- **Quality**: Battle-tested in production apps
- **No reinventing the wheel**: Solves complex interaction patterns

### Why Tailwind CSS?
- **Utility-first**: Fast iteration
- **Consistent**: Design tokens ensure consistency
- **Performance**: Purges unused styles
- **v4**: Latest features and improvements

### Why No Dark Mode?
- Focused on simplicity and consistency
- Resume editing benefits from light, neutral environment
- Can be added later if needed

### Typography Choices
- **System fonts**: Fast load, familiar feel
- **Clear hierarchy**: Distinguishes headings from body text
- **Readable**: Comfortable for extended editing sessions

## Future Improvements

- Add drag-and-drop section reordering (currently removed for simplicity)
- Template selection
- Export to different formats (DOCX, etc.)
- Collaborative editing
- Resume analytics
- Theme customization for preview

## Contributing

When adding new components:
1. Check if Radix UI has a primitive for it
2. Follow the existing component patterns in `src/app/components/ui/`
3. Use the `cn()` utility for conditional classes
4. Maintain accessibility standards
5. Keep styling minimal and neutral

## License

MIT
