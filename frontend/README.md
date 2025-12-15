# Taram Status Frontend

A clean, modern status page built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Real-time service status monitoring
- 24-hour uptime percentages
- Auto-refresh every 30 seconds
- Responsive design
- Clean, GitHub-style status page UI

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
cd frontend
npm install
```

### Running Locally

```bash
# Start dev server
npm run dev
```

The app will be available at http://localhost:3000

### Environment Variables

Create a `.env` file:

```bash
VITE_API_URL=http://localhost:8000
```

## Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker

The frontend is containerized and included in the main docker-compose.yml:

```bash
# Build and run
docker-compose up -d frontend

# The frontend will be available at http://localhost (via nginx)
```

## Architecture

```
src/
├── components/
│   ├── ServiceCard.tsx      # Individual service status card
│   ├── StatusBadge.tsx      # Status indicator badge
│   └── StatusPage.tsx       # Main status page layout
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Root component with data fetching
├── main.tsx                 # Application entry point
└── index.css                # Tailwind CSS imports
```

## Customization

### Adding New Services

Update the API to include new services - the frontend will automatically display them.

### Styling

The app uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.js` - Theme configuration
- Component files - Component-specific styles

### Refresh Interval

Change the auto-refresh interval in `App.tsx`:

```typescript
// Default: 30 seconds
const interval = setInterval(fetchStatus, 30000)
```

## Production Deployment

The Dockerfile creates a multi-stage build:
1. Build stage: Installs dependencies and builds the app
2. Runtime stage: Serves static files with nginx

The nginx configuration includes:
- SPA fallback routing
- Gzip compression
- Static asset caching
- Security headers
