import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import CreateTask from "./pages/createtask";
import { useState } from "react";
import CreateEmployee from "./components/createEmployee";

function App() {
  const [useSlicer, setSlicer] = useState(false);
  return (
    <main className="w-full h-screen flex flex-col gap-10 px-[120px] relative">
      <BrowserRouter>
        <Header useSlicer={useSlicer} setSlicer={setSlicer} />
        {useSlicer ? <CreateEmployee /> : <></>}
        <Routes>
          <Route path="/create_task" element={<CreateTask />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
