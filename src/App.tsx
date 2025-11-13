import Header from "./components/header";
import "./App.css";
import Preview from "./components/preview";
import UploadJson from "./components/upload-json";
import GroupedColors from "./components/grouped-colors";
import ExportJson from "./components/export-json";

function App() {
  return (
    <div className="app-container">
      <Header />
      <UploadJson />

      <div className="editor-container">
        <Preview />
        <div className="controls-section">
          <ExportJson />
          <GroupedColors />
        </div>
      </div>
    </div>
  );
}

export default App;
