import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { TaskContext } from "../context/TaskProvider";

function TaskDetail() {
  const data = useContext(TaskContext);
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [useTask, setTask] = useState();

  console.log(useTask);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskResponse = await axios.get(data.apiUrl(`/tasks/${taskId}`), {
          headers: {
            Authorization: `Bearer ${data.TOKEN}`,
          },
        });

        setTask(taskResponse.data);
      } catch (error) {
        console.log("Error while fetching task:", error);
      }
    };
    fetchTask();
  }, []);

  console.log(useTask);
  //   const getDepName = () => {
  //     if (useTask) {
  //       let department = useTask?.department.name;
  //       department = department.split(" ");

  //       if (useTask?.department.name == "ტექნოლოგიების დეპარტამენტი") {
  //         department = "ინფ. ტექ.";
  //       } else if (department.length == 2) {
  //         department = department[0];
  //       } else if (department.length == 3) {
  //         department =
  //           department[0].slice(0, 4) + ". " + department[1].slice(0, 4) + ".";
  //       } else {
  //         department =
  //           department[0].slice(0, 5) + ". " + department[2].slice(0, 5) + ".";
  //       }
  //       return department;
  //     }
  //     return "dizaini";
  //   };
  const [useStatus, setUseStatus] = useState(false);

  console.log(data?.statuses);
  return (
    <main className="flex justify-between">
      {useTask ? (
        <div>
          <section className="w-[715px] flex flex-col gap-[73px]">
            <section className="flex flex-col gap-[26px]">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-[18px]">
                  <div
                    className={`${
                      useTask.priority.name == "დაბალი"
                        ? "border-[#08a508]"
                        : useTask.priority.name == "საშუალო"
                        ? "border-[#ffbe0b]"
                        : "border-[#fa4d4d]"
                    } w-[86px] h-[26px] flex items-center justify-center gap-1 p-1 rounded-[5px] border-[0.5px] bg-[#fff]`}
                  >
                    <img src={useTask.priority.icon} alt="" />
                    <span
                      className={`${
                        useTask.priority.name == "დაბალი"
                          ? "text-[#08a508]"
                          : useTask.priority.name == "საშუალო"
                          ? "text-[#ffbe0b]"
                          : "text-[#fa4d4d]"
                      } text-xs font-500 leading-[1.5]`}
                    >
                      {useTask.priority.name}
                    </span>
                  </div>
                  <div
                    className={`${
                      useTask.department.name == "მედიის დეპარტამენტი"
                        ? "bg-[#ff66a8]"
                        : useTask.department.name ==
                          "ტექნოლოგიების დეპარტამენტი"
                        ? "bg-[#ffd86d]"
                        : useTask.department.name == "ლოჯოსტიკის დეპარტამენტი"
                        ? "bg-[#89b6ff]"
                        : useTask.department.name ==
                          "გაყიდვები და მარკეტინგის დეპარტამენტი"
                        ? "bg-[#0b6e0b]"
                        : useTask.department.name == "ფინანსების დეპარტამენტი"
                        ? "bg-[#fa4d4d]"
                        : useTask.department.name ==
                          "ადამიანური რესურსების დეპარტამენტი"
                        ? "bg-[#b31a59]"
                        : useTask.department.name ==
                          "ადმინისტრაციის დეპარტამენტი"
                        ? "bg-[#34989d]"
                        : ""
                    } px-[10px] py-[5px] rounded-[15px] text-xs text-[#fff] leading-[14px] grow-[0]`}
                  >
                    {useTask.department.name}
                  </div>
                </div>
                <h1 className="text-[34px] text-[#212529] leading-[41px] font-semibold">
                  {useTask.name}
                </h1>
              </div>
              <p className="text-lg text-[#000] leading-[1.5]">
                {useTask.description}
              </p>
            </section>
            <section className="w-[493px] flex flex-col gap-7">
              <h4 className="text-2xl text-[#2a2a2a] leading-[29px] font-semibold">
                დავალების დეტალები
              </h4>
              <section className="flex flex-col">
                <div className="h-[70px] flex items-center justify-between">
                  <div className="flex items-center gap-[6px]">
                    <img src="/pie-chart.png" alt="pie-chart" />
                    <span className="text-base text-[#474747] leading-[1.5]">
                      სტატუსი
                    </span>
                  </div>
                  <div className="relative">
                    <div
                      // onClick={() => openList("status")}
                      className={`${
                        useStatus
                          ? "border-b-0 rounded-t-[5px] border-[#8338EC]"
                          : "rounded-[5px] border-[#dee2e6]"
                      } w-[259px] h-[46px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                    >
                      <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                        {useTask.status.name}
                      </span>
                      {useStatus ? (
                        <img src="./arrow-up-v.png" alt="" />
                      ) : (
                        <img src="./arrow-down-b.png" alt="" />
                      )}
                    </div>
                    <section
                      className={`${
                        useStatus
                          ? "flex flex-col border-b border-r border-l rounded-b-[5px] border-[#8338EC]"
                          : "hidden"
                      } absolute w-full bg-[#fff] z-50 left-0 bottom-[1px] transform translate-y-full rounded-b-[5px]`}
                    >
                      {data.statuses?.map((e) => {
                        return (
                          <div
                            key={e.id}
                            // onClick={() => handleLists("status", e.id)}
                            className="w-[259px] h-[46px] p-[14px] cursor-pointer"
                          >
                            <span
                              id={e.id}
                              className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow"
                            >
                              {e.name}
                            </span>
                          </div>
                        );
                      })}
                    </section>
                  </div>
                </div>
                <div className="h-[70px] flex items-center justify-between">
                  <div className="flex items-center gap-[6px]">
                    <img src="/Frame 1000005864.png" alt="user" />
                    <span className="text-base text-[#474747] leading-[1.5]"></span>
                  </div>
                  <div>
                    <img src="" alt="" />
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="h-[70px] flex items-center justify-between">
                  <div className="flex items-center gap-[6px]">
                    <img src="/calendar.png" alt="date" />
                    <span className="text-base text-[#474747] leading-[1.5]"></span>
                  </div>
                  <span></span>
                </div>
              </section>
            </section>
          </section>
          <section></section>
        </div>
      ) : (
        "loadinnnngggg"
      )}
    </main>
  );
}

export default TaskDetail;
