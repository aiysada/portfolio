import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { OwnerSettingsProvider } from "@/context/OwnerSettingsContext";
import { router } from "@/routes";

export function App() {
  return (
    <ThemeProvider>
      <OwnerSettingsProvider>
        <RouterProvider router={router} />
      </OwnerSettingsProvider>
    </ThemeProvider>
  );
}

export default App;
