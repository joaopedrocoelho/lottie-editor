import Header from "./components/header";
import "./App.css";
import Preview from "./components/preview";
import { useLottieData } from "./context/lottie-data-provider";
import UploadJson from "./components/upload-json";
import GroupedColors from "./components/grouped-colors";
import ExportJson from "./components/export-json";

function App() {
  const { lottieData, groupedColors, animationKey } = useLottieData();

  return (
    <div className="app-container">
      <Header />
      <UploadJson />
      {lottieData && (
        <div className="editor-container">
          <Preview animationKey={animationKey} lottieData={lottieData} />
          <div className="controls-section">
            <ExportJson />
            {groupedColors.length > 0 ? (
              <GroupedColors />
            ) : (
              <p className="no-fills">
                No fill colors found in this animation.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
