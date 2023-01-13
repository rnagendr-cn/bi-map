import ChoroplethWorldNew from "./components/ChoroplethWorldNew"
import DotWorldMapNew from "./components/DotWorldMapNew"
import './style.css'

const styles = {
  width: "100%",
  // display: "flex",
  // flexDirec
}

function App() {
  return (
    <div style={styles}>
      <div className="us-map-page">
      <ChoroplethWorldNew />
      <DotWorldMapNew />
      </div>
    </div>
  );
}

export default App;
