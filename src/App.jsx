import { useState } from "react";
import CaseBriefScreen from "./screens/CaseBriefScreen";
import OrganizerScreen from "./screens/OrganizerScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("brief");

  if (currentScreen === "organizer") {
    return <OrganizerScreen />;
  }

  return (
    <CaseBriefScreen
      onBeginInvestigation={() => setCurrentScreen("organizer")}
    />
  );
}