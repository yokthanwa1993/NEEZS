# NEEZS Job App

A lightweight Expo prototype inspired by JobToday that showcases distinct seeker and employer experiences inside a single application.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the Expo development server:
   ```bash
   npx expo start
   ```
3. Use the Expo Go app or an emulator to open the project. The bottom tab bar lets you switch between the seeker and employer flows.

## App structure

- `App.js` wires up a bottom tab navigator with seeker and employer stacks.
- `src/screens/SeekerScreen.js` lists curated roles with category filters and rich job cards.
- `src/screens/EmployerScreen.js` highlights active postings and featured applicants for quick triage.
- `src/components` contains small presentational pieces such as job and applicant cards.
- `src/shared/data/mockData.js` houses static sample content that can later be replaced with API data.

Feel free to extend the mock data, connect real APIs, or add authentication to build out a production-ready experience.
