import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/Homepage";
import Regalospage from "./pages/regalos/Regalospage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/regalos" element={<Regalospage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
