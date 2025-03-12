import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import CreateTask from "./pages/createtask";

function App() {
  return (
    <main className="w-full h-screen flex flex-col gap-10 px-[120px]">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/create_task" element={<CreateTask />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
