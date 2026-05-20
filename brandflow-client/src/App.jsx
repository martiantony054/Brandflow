import { useState } from "react";
import { T, GLOBAL_CSS } from "./lib/theme";
import Sidebar from "./Components/layout/Sidebar";
import GenerateView from "./Components/views/GenerateView";
import RepurposeView from "./Components/views/RepurposeView";
import PredictView from "./Components/views/PredictView";

const VIEW_MAP = {
  generate: GenerateView,
  repurpose: RepurposeView, 
  predict: PredictView,
};

function App() {
  const [view, setView] = useState("generate");
  const ActiveView = VIEW_MAP[view];
  return (
    <>
     
      <style>{GLOBAL_CSS}</style>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: T.bg,
          color: T.text,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-110px",
            right: "-90px",
            width: "320px",
            height: "320px",
            background: "rgba(189,255,68,0.045)",
            borderRadius: "50%",
            filter: "blur(90px)",
            animation: "orbA 16s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "-90px",
            left: "90px",
            width: "240px",
            height: "240px",
            background: "rgba(91,158,255,0.038)",
            borderRadius: "50%",
            filter: "blur(70px)",
            animation: "orbB 20s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Sidebar view={view} onNavigate={setView} />
        <main
          key={view}
          style={{
            flex: 1,
            overflow: "auto",
            minWidth: 0,
            position: "relative",
            zIndex: 1,
          }}
        >
          <ActiveView />
        </main>
      </div>
    </>
  );
}

export default App;
