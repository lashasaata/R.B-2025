import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { TaskContext } from "../context/TaskProvider";

function TaskDetail() {
  const data = useContext(TaskContext);
  const { taskId } = useParams();
  const safeTaskId = taskId || "";
  const navigate = useNavigate();

  const [useTask, setTask] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [useStatus, setUseStatus] = useState({
    name: "",
    status_id: 0,
  });
  const [status, openStatus] = useState(false);

  console.log(useTask);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskResponse = await axios.get(data.apiUrl(`/tasks/${taskId}`), {
          headers: {
            Authorization: `Bearer ${data.TOKEN}`,
          },
        });
        const statusesResponse = await axios.get(data.apiUrl(`/statuses`));
        setStatuses(statusesResponse.data);
        setUseStatus({
          status_id: taskResponse.data.status.id,
        });
        setTask(taskResponse.data);
      } catch (error) {
        console.log("Error while fetching task:", error);
      }
    };
    fetchTask();
  }, [safeTaskId]);

  useEffect(() => {
    const putStatus = async () => {
      try {
        const statusResponse = await axios.put(
          data.apiUrl(`/tasks/${taskId}`),
          {
            status_id: useStatus.status_id,
          },
          {
            headers: {
              Authorization: `Bearer ${data.TOKEN}`,
            },
          }
        );
        console.log(statusResponse);
      } catch (error) {
        console.log("Failed posting status:", error);
      }
    };

    putStatus();
  }, [useStatus]);

  const handleStatus = (name, id) => {
    setUseStatus({
      name: name,
      status_id: id,
    });
    openStatus(false);
  };

  console.log(useTask);

  const date = new Date(useTask?.due_date);

  const georgianDays = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"];

  const weekDay = date.getDay();
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.getMonth();
  const year = date.getFullYear();

  const formattedDate = `${georgianDays[weekDay - 1]} - ${day}/${
    month + 1
  }/${year}`;

  console.log(date);

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
            <section className="w-[520px] flex flex-col gap-7">
              <h4 className="text-2xl text-[#2a2a2a] leading-[29px] font-semibold">
                დავალების დეტალები
              </h4>
              <section className="flex flex-col">
                <div className="h-[70px] flex items-center gap-[70px]">
                  <div className="w-[164px] flex items-center gap-[6px]">
                    <img src="/pie-chart.png" alt="pie-chart" />
                    <span className="text-base text-[#474747] leading-[1.5]">
                      სტატუსი
                    </span>
                  </div>
                  <div className="relative">
                    <div
                      onClick={() => openStatus(!status)}
                      className={`${
                        status
                          ? "border-b-0 rounded-t-[5px] border-[#8338EC]"
                          : "rounded-[5px] border-[#dee2e6]"
                      } w-[259px] h-[46px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                    >
                      <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                        {useStatus.name ? useStatus.name : useTask.status.name}
                      </span>
                      {status ? (
                        <img src="/arrow-up-v.png" alt="close" />
                      ) : (
                        <img src="/arrow-down-b.png" alt="open" />
                      )}
                    </div>
                    <section
                      className={`${
                        status
                          ? "flex flex-col border-b border-r border-l rounded-b-[5px] border-[#8338EC]"
                          : "hidden"
                      } absolute w-full bg-[#fff] z-50 left-0 bottom-[1px] transform translate-y-full rounded-b-[5px]`}
                    >
                      {statuses?.map((e) => {
                        return (
                          <div
                            key={e.id}
                            onClick={() => handleStatus(e.name, e.id)}
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
                <div className="h-[70px] flex items-center gap-[70px]">
                  <div className="w-[164px] flex items-center gap-[6px]">
                    <img src="/Frame 1000005864.png" alt="user" />
                    <span className="text-base text-[#474747] leading-[1.5]">
                      თანამშრომელი
                    </span>
                  </div>
                  <div className="w-[270px] relative flex items-center gap-3">
                    <img
                      src={useTask.employee.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-[#0d0f10] leading-[1.5]">
                      {useTask.employee.name} {useTask.employee.surname}
                    </span>
                    <span className="absolute left-[43px] top-[-9px] text-[11px] text-[#474747] leading-[13px] font-300">
                      {useTask.employee.department.name}
                    </span>
                  </div>
                </div>
                <div className="h-[70px] flex items-center gap-[70px]">
                  <div className="w-[164px] flex items-center gap-[6px]">
                    <img src="/calendar.png" alt="date" />
                    <span className="text-base text-[#474747] leading-[1.5]">
                      დავალების ვადა
                    </span>
                  </div>
                  <span className="text-sm text-[#0d0f10] leading-[1.5] font-medium">
                    {formattedDate}
                  </span>
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
