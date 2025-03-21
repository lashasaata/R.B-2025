import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { TaskContext } from "../context/TaskProvider";

function TaskDetail() {
  //   const data = useContext(TaskContext);
  const API_URL = "https://momentum.redberryinternship.ge/api";
  const TOKEN = "9e6c9438-0bca-4337-a267-f9a7fd99f68b";

  const apiUrl = (endpoint) => `${API_URL}${endpoint}`;

  const { taskId } = useParams();
  const safeTaskId = taskId || "";

  const [useTask, setTask] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [useStatus, setUseStatus] = useState({
    name: "",
    status_id: 0,
  });
  const [status, openStatus] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const taskResponse = await axios.get(apiUrl(`/tasks/${taskId}`), {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        const statusesResponse = await axios.get(apiUrl(`/statuses`));
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
          apiUrl(`/tasks/${taskId}`),
          {
            status_id: useStatus.status_id,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
      } catch (error) {
        console.log("Failed posting status:", error);
      }
    };

    putStatus();
  }, [useStatus]);

  const [comments, setComments] = useState([]);

  const getCommentsA = () => {
    let amount = 0;
    comments.map((e) => {
      amount += e.sub_comments?.length + 1;
    });
    return amount;
  };

  const handleStatus = (name, id) => {
    setUseStatus({
      name: name,
      status_id: id,
    });
    openStatus(false);
  };

  const date = new Date(useTask?.due_date);

  const georgianDays = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ", "შაბ", "კვი"];

  const weekDay = date.getDay();
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.getMonth();
  const year = date.getFullYear();

  const formattedDate = `${georgianDays[weekDay - 1]} - ${day}/${
    month + 1
  }/${year}`;

  const [isError, setError] = useState({});

  const [subComs, setSubComs] = useState();
  const [replies, setReplies] = useState({
    parent: "",
  });

  const handleSubComs = (id) => {
    if (subComs == id) {
      setSubComs(null);
    } else {
      setSubComs(id);
      setReplies({
        parent: "",
      });
    }
  };

  const changeReply = (event, id) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [id]: event.target.value,
    }));
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsResponse = await axios.get(
          apiUrl(`/tasks/${taskId}/comments`),
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.log("Failed posting status:", error);
      }
    };

    fetchComments();
  }, [isError]);

  const handleComment = async (id = null) => {
    const commentValue = replies[id] ? replies[id] : "";
    const trimed = commentValue.trim();
    const idF = id == "parent" ? null : id;

    if (trimed.length > 0) {
      try {
        const commentResponse = await axios.post(
          apiUrl(`/tasks/${taskId}/comments`),
          {
            text: trimed,
            parent_id: idF,
          },
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (id == "parent") {
          setComments([commentResponse.data, ...comments]);
          setSubComs(null);
        } else {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === id
                ? {
                    ...comment,
                    sub_comments: [
                      ...comment.sub_comments,
                      commentResponse.data,
                    ],
                  }
                : comment
            )
          );
          handleSubComs(id);
        }
        setReplies({
          parent: "",
        });
      } catch (error) {
        console.log("Filed posting comment:", error);
      }
      setError({
        [id]: false,
      });
    } else {
      setError({
        [id]: true,
      });
    }
  };

  const [isHovered, setHovered] = useState();

  const handleHover = (id) => {
    if (isHovered) {
      setHovered(null);
    } else {
      setHovered(id);
    }
  };

  return (
    <main className="flex">
      {useTask ? (
        <div className="w-full flex justify-between mb-20">
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
          <section className="w-[741px] flex flex-col gap-[66px] rounded-[10px] border-[0.3px] border-[#ddd2ff] px-[45px] pt-10 pb-[52px] commentsBg">
            <div
              className={`${
                isError.parent ? "border-[#F93B1D]" : "border-[#adb5bd]"
              } w-[651px] flex flex-col items-end rounded-[10px] border-[0.3px] bg-[#fff] px-5 pt-[18px] pb-[15px]`}
            >
              <textarea
                name="comment"
                id="parent"
                value={replies.parent}
                onChange={(e) => changeReply(e, "parent")}
                placeholder="დაწერე კომენტარი"
                className="w-full h-[85px] outline-none resize-none pb-2 placeholder:text-sm placeholder:text-[#898989] placeholder:leading-[17px] text-sm text-[#0D0F10] leading-[17px]"
              />
              <button
                onClick={() => handleComment("parent")}
                className="w-[153px] h-[35px] flex items-center justify-center rounded-[20px] bg-[#8338ec] hover:bg-[#B588F4] text-base text-[#fff] leading-[19px] cursor-pointer"
              >
                დააკომენტარე
              </button>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-[7px]">
                <h4 className="text-[20px] text-[#000] leading-[24px] font-500">
                  კომენტარები
                </h4>
                <div className="w-[30px] h-[22px] flex items-center justify-center rounded-[30px] bg-[#8338ec] text-sm text-[#fff] leading-[17px] font-semibold">
                  {getCommentsA()}
                </div>
              </div>
              <div className="flex flex-col gap-[38px]">
                {comments.map((element) => {
                  return (
                    <section key={element.id} className="flex flex-col gap-5">
                      <div className="flex gap-3 pr-[53px]">
                        <div>
                          <img
                            src={element.author_avatar}
                            alt="avatar"
                            className="w-[38px] h-[38px] rounded-[40px]"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-lg text-[#212529] leading-[21px] font-500">
                            {element.author_nickname}
                          </span>
                          <p className="w-[548px] text-base text-[#343a40] leading-[19px]">
                            {element.text}
                          </p>
                          <div
                            className="flex items-center gap-[6px] py-[5px] mt-[2px] cursor-pointer"
                            onMouseEnter={() => handleHover(element.id)}
                            onMouseLeave={() => handleHover(element.id)}
                            onClick={() => handleSubComs(element.id)}
                          >
                            <img
                              src={
                                isHovered == element.id
                                  ? "/Left 2 (1).png"
                                  : "/Left 2.png"
                              }
                              alt="reply"
                            />
                            <span
                              className={`${
                                isHovered == element.id
                                  ? "text-[#B588F4]"
                                  : "text-[#8338ec]"
                              } text-xs leading-[14px]`}
                            >
                              უპასუხე
                            </span>
                          </div>
                        </div>
                      </div>
                      {subComs == element.id ? (
                        <div
                          className={`${
                            isError[element.id]
                              ? "border-[#F93B1D]"
                              : "border-[#adb5bd]"
                          } w-[651px] flex flex-col items-end rounded-[10px] border-[0.3px] bg-[#fff] px-5 pt-[18px] pb-[15px]`}
                        >
                          <textarea
                            onChange={(e) => changeReply(e, element.id)}
                            name="comment"
                            id=""
                            value={replies[element.id]}
                            placeholder="დაწერე კომენტარი"
                            className="w-full h-[55px] outline-none resize-none pb-2 placeholder:text-sm placeholder:text-[#898989] placeholder:leading-[17px] text-sm text-[#0D0F10] leading-[17px]"
                          />
                          <button
                            onClick={() => handleComment(element.id)}
                            className="w-[153px] h-[35px] flex items-center justify-center rounded-[20px] bg-[#8338ec] hover:bg-[#B588F4] text-base text-[#fff] leading-[19px] cursor-pointer"
                          >
                            დააკომენტარე
                          </button>
                        </div>
                      ) : (
                        ""
                      )}
                      {element.sub_comments?.map((sub) => {
                        return (
                          <div key={sub.id} className="flex gap-3 pl-[53px]">
                            <div>
                              <img
                                src={sub.author_avatar}
                                alt="avatar"
                                className="w-[38px] h-[38px] rounded-[40px]"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-lg text-[#212529] leading-[21px] font-500">
                                {sub.author_nickname}
                              </span>
                              <p className="w-[548px] text-base text-[#343a40] leading-[19px]">
                                {sub.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : (
        "loadinnnngggg"
      )}
    </main>
  );
}

export default TaskDetail;
