import "./App.css";
import { useState } from "react";
import ChangeColors from "./components/change-colors/change-colors";
import SwitchParts from "./components/switch-parts/switch-parts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { LottieDataProvider } from "./context/lottie-data-provider";
import { SwitchPartsProvider } from "./context/switch-parts-provider";

function App() {
  const [activeTab, setActiveTab] = useState("switch-parts");

  return (
    <div className="app-container">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full bg-none"
      >
        <TabsList className="flex w-full  gap-x-6">
          <TabsTrigger
            value="switch-parts"
            className={
              activeTab === "switch-parts"
                ? "bg-indigo-400 border-indigo-800 border-4"
                : ""
            }
          >
            Switch Parts
          </TabsTrigger>
          <TabsTrigger
            value="change-colors"
            className={
              activeTab === "change-colors"
                ? "bg-indigo-400 border-indigo-800 border-4"
                : ""
            }
          >
            Change Colors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="switch-parts">
          <SwitchPartsProvider>
            <SwitchParts />
          </SwitchPartsProvider>
        </TabsContent>
        <TabsContent value="change-colors">
          <LottieDataProvider>
            <ChangeColors />
          </LottieDataProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
