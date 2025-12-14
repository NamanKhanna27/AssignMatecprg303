// App.js
import AppProviders from "./src/app/AppProviders";

/*
  App is intentionally kept minimal. All global providers live in src/app/AppProviders.jsx
  to keep the entry point clean and easy to maintain.
*/
export default function App() {
  return <AppProviders />;
}
