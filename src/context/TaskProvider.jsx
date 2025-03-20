import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [useSlicer, setSlicer] = useState(false);
  const [useFixed, setFixed] = useState({
    departments: [],
    statuses: [],
    priorities: [],
  });
  const [useData, setData] = useState({
    employees: [],
    tasks: [],
  });
  //   const API_URL = import.meta.env.VITE_API_URL;
  //   const TOKEN = import.meta.env.VITE_AUTH_TOKEN;
  const API_URL = "https://momentum.redberryinternship.ge/api";
  const TOKEN = "9e6c9438-0bca-4337-a267-f9a7fd99f68b";

  const apiUrl = (endpoint) => `${API_URL}${endpoint}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTasks = await axios.get(apiUrl("/tasks"), {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const responseEmployees = await axios.get(apiUrl("/employees"), {
          headers: { Authorization: `Bearer ${TOKEN}` },
        });
        setData((prevData) => ({
          ...prevData,
          employees: responseEmployees.data,
          tasks: responseTasks.data,
        }));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDepartments = await axios.get(apiUrl("/departments"));
        const responsePriorities = await axios.get(apiUrl("/priorities"));
        const responseStatuses = await axios.get(apiUrl("/statuses"));

        setFixed((prevData) => ({
          ...prevData,
          departments: responseDepartments.data,
          priorities: responsePriorities.data,
          statuses: responseStatuses.data,
        }));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [useData]);

  return (
    <TaskContext.Provider
      value={{
        useFixed,
        useData,
        setData,
        useSlicer,
        setSlicer,
        API_URL,
        TOKEN,
        apiUrl,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
