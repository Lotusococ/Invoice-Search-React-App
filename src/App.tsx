import { BrowserRouter as Router, Routes } from "react-router-dom";
import { renderRoutes } from "src/Routes/routes";

function App() {
  return (
    <Router>
      <Routes>
        {renderRoutes()}
      </Routes>
    </Router>
  );
}

export default App;  