import React from "react";
import Header from "./components/Header";
import BoardArea from "./components/BoardArea";

const App: React.FC = () => (
  <div className="min-h-screen" style={{ 
    background: "var(--bg)", 
    color: "var(--text)",
    transition: "background-color 0.3s, color 0.3s"
  }}>
    <Header />
    <BoardArea />
  </div>
);

export default App;
