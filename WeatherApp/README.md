# WeatherApp - RainQuant

A React Native application for weather and rainfall prediction with AI-powered analysis.

## Features

- **Real-time Weather Data**: Fetch current weather and rainfall data for any location
- **AI Analysis**: Get AI-powered drought risk assessments and recommendations
- **Interactive Charts**: Visualize rainfall trends with beautiful charts
- **Location Services**: Automatic location detection or manual configuration
- **Alert System**: Receive notifications about drought conditions
- **Historical Data**: View complete historical rainfall records

## Project Structure

```
WeatherApp/
├── src/
│   ├── components/        # Reusable components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   ├── charts/     # Chart components
│   │   ├── maps/       # Map components
│   │   └── settings/   # Settings components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation setup
│   ├── services/       # API services
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main app component
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS (Mac only):
```bash
cd ios && pod install && cd ..
```

3. Run the app:

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

## Components Overview

### Screens
- **DashboardScreen**: Main screen with weather stats, charts, and AI analysis
- **SettingsScreen**: Configure location, alerts, and preferences

### Dashboard Components
- **WeatherStats**: Display key weather statistics
- **RainfallChart**: Interactive chart showing rainfall trends
- **DroughtAnalysis**: AI-powered drought risk analysis
- **DataTable**: Historical data in a collapsible table

### Charts
- **RainfallChart**: Victory Native-based rainfall visualization

### Settings
- **SettingsScreen**: Full settings interface with location and alert configuration

## Configuration

### Setup API Integration

Replace the mock API in `src/App.tsx` with your actual backend:

```typescript
const apiClient = {
  fetchWeatherData: async (location) => {
    // Your API call
  },
  runAIAnalysis: async () => {
    // Your AI analysis API
  },
  // ... other methods
};
```

### Environment Variables

Create a `.env` file for API keys:

```
WEATHER_API_KEY=your_key_here
AI_API_KEY=your_key_here
```

## Dependencies

- **react-native**: Core framework
- **@react-navigation**: Navigation
- **@tanstack/react-query**: Data fetching
- **react-native-maps**: Map functionality
- **victory-native**: Charts
- **date-fns**: Date formatting
- **react-native-geolocation-service**: Location services

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure your API endpoints in `src/App.tsx`
4. Run the app on Android or iOS

## License

MIT


