import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";
import BoardArea from "./components/BoardArea";

const App: React.FC = () => (
  <ThemeProvider>
    <div className="min-h-screen">
      <Header />
      <BoardArea />
    </div>
  </ThemeProvider>
);

export default App;
