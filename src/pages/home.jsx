import axios from "axios";
import { useEffect, useState } from "react";

function Home() {
  const [useData, setData] = useState({
    departments: [],
    priorities: [],
    employees: [],
    tasks: [],
  });
  const [useListing, setListing] = useState({
    departments: false,
    priorities: false,
    employees: false,
  });

  useEffect(() => {
    const apiUrl = (endpoint) =>
      `https://momentum.redberryinternship.ge/api/${endpoint}`;
    const token = "9e6c9438-0bca-4337-a267-f9a7fd99f68b";

    const fetchData = async () => {
      try {
        const responseD = await axios.get(apiUrl("departments"));
        const responseP = await axios.get(apiUrl("priorities"));
        const responseE = await axios.get(apiUrl("employees"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseT = await axios.get(apiUrl("tasks"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData((prevData) => ({
          ...prevData,
          departments: responseD.data,
          priorities: responseP.data,
          employees: responseE.data,
          tasks: responseT.data,
        }));
      } catch (error) {
        console.log("Error while fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log(useData);
  console.log(useListing);

  // FINDS which filter section is open
  const findKeyByValue = (obj, value = true) => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const openList = (listType) => {
    setListing((prevListings) => ({
      departments: false,
      priorities: false,
      employees: false,
      [listType]: !prevListings[listType],
    }));

    setSelectedBoxes(chosenBoxes);
  };

  const [filteredData, setFilteredData] = useState({
    toDos: [],
    inProgress: [],
    forTesting: [],
    completed: [],
  });

  useEffect(() => {
    apply();
  }, [useData.tasks]);

  const [chosenBoxes, setChosenBoxes] = useState({
    departments: [],
    priorities: [],
    employees: [],
  });
  const [selectedBoxes, setSelectedBoxes] = useState({
    departments: [],
    priorities: [],
    employees: [],
  });

  const handleFilter = (field, id) => {
    if (selectedBoxes[field].includes(id)) {
      if (field == "employees") {
        setSelectedBoxes({
          ...selectedBoxes,
          [field]: [],
        });
      } else {
        setSelectedBoxes({
          ...selectedBoxes,
          [field]: selectedBoxes[field].filter((item) => item !== id),
        });
      }
    } else {
      if (field == "employees") {
        setSelectedBoxes({
          ...selectedBoxes,
          [field]: [id],
        });
      } else {
        setSelectedBoxes({
          ...selectedBoxes,
          [field]: [...selectedBoxes[field], id],
        });
      }
    }
  };

  const apply = () => {
    let idsForFilter = structuredClone(selectedBoxes);

    Object.entries(idsForFilter).forEach(([key, value]) => {
      if (value.length === 0) {
        idsForFilter[key] = useData[key]?.map((item) => item.id);
      }
    });

    let filterdata = {
      toDos: [],
      inProgress: [],
      forTesting: [],
      completed: [],
    };

    useData.tasks.forEach((task) => {
      if (
        idsForFilter.departments.includes(task.department.id) &&
        idsForFilter.priorities.includes(task.priority.id) &&
        idsForFilter.employees.includes(task.employee.id)
      ) {
        let status = "";

        switch (task.status.id) {
          case 1:
            status = "toDos";
            break;
          case 2:
            status = "inProgress";
            break;
          case 3:
            status = "forTesting";
            break;
          case 4:
            status = "completed";
            break;
          default:
            console.warn("Unknown status:", task.status.id);
        }

        filterdata[status].push(task);
      }
    });

    setChosenBoxes(selectedBoxes);
    setFilteredData(filterdata);
  };

  return (
    <main className="flex flex-col gap-[52px]">
      <h1 className="text-[34px] text-[#212529] font-[600] leading-[41px]">
        დავალებების გვერდი
      </h1>
      <section className="relative w-[688px] flex items-center gap-[45px] rounded-[10px] border border-[#dee2e6]">
        <div
          className="w-[199px] flex items-center gap-2 py-[10px] pl-[18px]"
          onClick={() => openList("departments")}
        >
          <span className="text-base text-[#0d0f10] leading-[19px]">
            დეპარტამენტი
          </span>
          <img src="./Icon.png" alt="open" />
        </div>
        <div
          className="w-[199px] flex items-center gap-2 py-[10px] pl-[18px]"
          onClick={() => openList("priorities")}
        >
          <span className="text-base text-[#0d0f10] leading-[19px]">
            პრიორიტეტი
          </span>
          <img src="./Icon.png" alt="open" />
        </div>
        <div
          className=" w-[199px] flex items-center gap-2 py-[10px] pl-[18px]"
          onClick={() => openList("employees")}
        >
          <span className="text-base text-[#0d0f10] leading-[19px]">
            თანამშრომელი
          </span>
          <img src="./Icon.png" alt="open" />
        </div>
        <section
          className={`${
            findKeyByValue(useListing, true)
              ? "flex flex-col gap-[25px]"
              : "hidden"
          } absolute left-[-2px] bottom-[-11px] transform translate-y-full w-[688px] rounded-[10px] border-[0.5px] border-[#8338ec] bg-[#fff] pt-10 px-[30px] pb-[10px]`}
        >
          <div className="flex flex-col gap-[22px]">
            {useData[findKeyByValue(useListing, true)]?.map((e) => {
              let chosenSection = findKeyByValue(useListing);
              console.log(e.id);
              return (
                <div key={e.id} className="flex items-center gap-[15px]">
                  <input
                    type="checkbox"
                    name={e.name}
                    id={e.id}
                    className="hidden peer"
                  />
                  <div
                    className={`${
                      chosenSection == "departments"
                        ? "border-[#212529]"
                        : "border-[#8338ec]"
                    } outline-none w-[22px] h-[22px] flex items-center justify-center rounded-[6px] border-[1.5px] `}
                    onClick={() => handleFilter(chosenSection, e.id)}
                  >
                    {chosenSection == "departments" &&
                    selectedBoxes.departments.includes(e.id) ? (
                      <img src="./check.svg" alt="check" />
                    ) : selectedBoxes[chosenSection].includes(e.id) ? (
                      <img src="./Vector (1).png" alt="check" />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="flex items-center gap-[10px] text-base text-[#212529] leading-[19px]">
                    {chosenSection == "employees" ? (
                      <>
                        <img
                          src={e.avatar}
                          alt="avatar"
                          className="w-[28px] h-[28px] rounded-full"
                        />
                        <span>
                          {e.name} {e.surname}
                        </span>
                      </>
                    ) : (
                      e.name
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="flex items-center justify-center self-end w-[155px] h-[35px] rounded-[20px] bg-[#8338ec] text-base text-[#fff] leading-[19px] cursor-pointer hover:bg-[#B588F4]"
            onClick={apply}
          >
            არჩევა
          </button>
        </section>
      </section>
      <section></section>
    </main>
  );
}

export default Home;
