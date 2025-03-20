import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskProvider";
import Header from "./components/header";
import CreateTask from "./pages/createtask";
import { useState } from "react";
import CreateEmployee from "./components/createEmployee";
import TaskDetail from "./pages/taskDetail";
import Home from "./pages/home";

function App() {
  const [useSlicer, setSlicer] = useState(false);
  return (
    <TaskProvider>
      <main className="w-full h-screen flex flex-col gap-10 px-[120px] relative">
        <BrowserRouter>
          <Header setSlicer={setSlicer} />
          {useSlicer && <CreateEmployee setSlicer={setSlicer} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks/:taskId" element={<TaskDetail />} />
            <Route
              path="/create_task"
              element={
                <CreateTask setSlicer={setSlicer} useSlicer={useSlicer} />
              }
            />
          </Routes>
        </BrowserRouter>
      </main>
    </TaskProvider>
  );
}

export default App;
