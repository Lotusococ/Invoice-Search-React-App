import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./languages/en-us/en";
import { ja } from "./languages/ja-jp/ja";
import { CustomThemeProvider } from "src/contexts/ThemeContext";
import { initializeFirebase } from "src/interface/Firebase/firebaseConfig"
import { SnackbarProvider } from 'notistack';
import { sendCustomTraceLog } from "./interface/Axiom Log/sendCustomTraceLog";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      ja: ja
    },
    lng: navigator.language,
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

initializeFirebase()
  .then(() => {
    root.render(
      <React.StrictMode>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <CustomThemeProvider>
            <App />
          </CustomThemeProvider>
        </SnackbarProvider>
      </React.StrictMode>
    );
  }).catch((error) => {
    sendCustomTraceLog(null, "Failed to initialize firebase: " + error, "error", "index.tsx");
  });

reportWebVitals();
