import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/Home";
import QuestDetail from "@/pages/QuestDetail";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quest/:id" element={<QuestDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}