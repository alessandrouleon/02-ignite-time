import { Button } from "./components/Button";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/default";
import { GlobalStyle } from "./styles/global";
import PhotoModal from "./components";
export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Button variant="primary" />

      <PhotoModal />

      <GlobalStyle />
    </ThemeProvider>
  );
}
