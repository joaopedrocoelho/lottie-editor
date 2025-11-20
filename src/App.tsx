import "./App.css";
import { useState } from "react";
import ChangeColors from "./components/change-colors/change-colors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { LottieDataProvider } from "./context/lottie-data-provider";
import CreateRandomChar from "./components/create-random-char/create-random-char";

function App() {
  const [activeTab, setActiveTab] = useState("create-random-char");

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
          <TabsTrigger
            value="create-random-char"
            className={
              activeTab === "create-random-char"
                ? "bg-indigo-400 border-indigo-800 border-4"
                : ""
            }
          >
            Create Random Char
          </TabsTrigger>
        </TabsList>
        <TabsContent value="change-colors">
          <LottieDataProvider>
            <ChangeColors />
          </LottieDataProvider>
        </TabsContent>
        <TabsContent value="create-random-char">
          <LottieDataProvider>
            <CreateRandomChar />
          </LottieDataProvider>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
