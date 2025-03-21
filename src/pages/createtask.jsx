import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  name: yup
    .string()
    .transform((value) => value.trim())
    .required("სათაური სავალდებულოა")
    .min(3, "სულ მცირე 3 სიმბოლო")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),
  description: yup
    .string()
    .transform((value) => (value.trim() === "" ? undefined : value.trim()))
    .notRequired()
    .test("minWords", "უნდა შეიცავდეს მინიმუმ 4 სიტყვას", (value) => {
      if (!value) return true; // Allow empty value
      return value.split(/\s+/).filter(Boolean).length >= 4;
    })
    .max(255, "მაქსიმუმ 255 სიმბოლო"),
  priority_id: yup.string().required("პრიორიტეტის არჩევა სავალდებულოა"),
  status_id: yup.string().required("სტატუსის არჩევა სავალდებულოა"),
  department_id: yup.string().required("დეპარტამენტის არჩევა სავალდებულოა"),
  employee_id: yup.string().required("თანამშრომლის არჩევა სავალდებულოა"),
  due_date: yup.string().notRequired(),
});

function CreateTask(props) {
  const token = "9e6c9438-0bca-4337-a267-f9a7fd99f68b";
  const apiUrl = (endpoint) =>
    `https://momentum.redberryinternship.ge/api/${endpoint}`;
  const navigate = useNavigate();
  const [isSubmited, setSubmited] = useState(false);
  const [useData, setData] = useState({
    statuses: [],
    priorities: [],
    departments: [],
    employees: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statuses = await axios.get(apiUrl("statuses"));
        const priorities = await axios.get(apiUrl("priorities"));
        const departments = await axios.get(apiUrl("departments"));
        const employees = await axios.get(apiUrl("employees"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData((prevData) => ({
          ...prevData,
          statuses: statuses.data,
          priorities: priorities.data,
          departments: departments.data,
          employees: employees.data,
        }));
      } catch (error) {
        console.log("Fetching data error:", error);
      }
    };
    fetchData();
  }, [props.useSlicer]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: JSON.parse(localStorage.getItem("taskFormData")) || {
      name: "",
      description: "",
      priority_id: "",
      status_id: "",
      department_id: "",
      employee_id: "",
      due_date: "",
    },
  });

  const inputs = watch();

  // Function to update localStorage
  const saveFormData = (data) => {
    localStorage.setItem("taskFormData", JSON.stringify(data));
  };

  // Save visible input values automatically
  useEffect(() => {
    saveFormData(getValues());
  }, [inputs]);

  const [listings, setListings] = useState({
    status: false,
    priority: false,
    department: false,
    employee: false,
    deadline: false,
  });

  const [ids, setIds] = useState({
    status_id: 0,
    priority_id: 0,
    department_id: 0,
    employee_id: 0,
  });

  const openList = (listType) => {
    setListings((prevListings) => ({
      status: false,
      priority: false,
      department: false,
      employee: false,
      deadline: false,
      [listType]: !prevListings[listType],
    }));
  };

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("taskIds"));
    if (savedIds) {
      setIds(savedIds); // Restore `ids` separately
    }

    const savedData = JSON.parse(localStorage.getItem("taskFormData"));
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key, savedData[key], { shouldValidate: false });
      });
    }
  }, [setValue]);

  const handleLists = (listType, id) => {
    if (listType == "department" && ids.department_id != id) {
      if (isSubmited) {
        setValue(`employee_id`, undefined, { shouldValidate: true });
      } else {
        setValue(`employee_id`, undefined, { shouldValidate: false });
      }
      setIds((prevIds) => ({
        ...prevIds,
        employee_id: 0,
        [`${listType}_id`]: id,
      }));

      localStorage.setItem(
        "taskIds",
        JSON.stringify({
          ...ids,
          employee_id: 0,
          [`${listType}_id`]: id,
        })
      );
    } else {
      setIds((prevIds) => ({
        ...prevIds,
        [`${listType}_id`]: id,
      }));
    }

    setValue(`${listType}_id`, id, { shouldValidate: true });
    localStorage.setItem(
      "taskIds",
      JSON.stringify({
        ...ids,
        [`${listType}_id`]: id,
      })
    );

    setListings((prevListings) => ({
      ...prevListings,
      [listType]: false,
    }));
  };

  const handleNewEmployee = () => {
    props.setSlicer(true);

    setListings((prevListings) => ({
      ...prevListings,
      employee: false,
    }));
  };

  let today = new Date();
  const [dateValue, setDateValue] = useState("");
  // const storedDate = localStorage.getItem("date");
  // const parsedDate = storedDate ? new Date(JSON.parse(storedDate)) : new Date();

  const [chosenDate, setChosenDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  let year = selectedDate.getFullYear();
  let month = selectedDate.getMonth();

  const lastOfMonth = new Date(year, month + 1, 0);
  const lastOfPrevMonth = new Date(year, month, 0);

  let prevWDays = [];
  for (let i = 0; i <= lastOfPrevMonth.getDay(); i++) {
    let day = lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + i;
    prevWDays.push(day);
  }

  const firstOfNextMonth = new Date(year, month + 1, 1);

  let nextWDays = [];
  for (let i = firstOfNextMonth.getDay(); i < 7; i++) {
    let day = firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + i;
    nextWDays.push(day);
  }

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getFullYear() === selectedDate.getFullYear()
    );
  };

  const setDate = (e) => {
    e.preventDefault();
    let date = e.target.innerText;
    let newDate = new Date(year, month, date);
    setSelectedDate(newDate);
  };

  const changeMonth = (type) => {
    if (type == "next") {
      if (month == 11) year++;
      month = (month + 1) % 12;
      let newDate = new Date(year, month, selectedDate.getDate());
      setSelectedDate(newDate);
    } else {
      if (month == 0) year--;
      month = (month - 1 + 12) % 12;
      let newDate = new Date(year, month, selectedDate.getDate());
      setSelectedDate(newDate);
    }
  };

  const monthName = (month) => {
    switch (month) {
      case 0:
        return "იანვარი";
      case 1:
        return "თებერვალი";
      case 2:
        return "მარტი";
      case 3:
        return "აპრილი";
      case 4:
        return "მაისი";
      case 5:
        return "ივნისი";
      case 6:
        return "ივლისი";
      case 7:
        return "აგვისტო";
      case 8:
        return "სექტემბერი";
      case 9:
        return "ოქტომბერი";
      case 10:
        return "ნოემბერი";
      case 11:
        return "დეკემბერი";
      default:
        return "უცნობი თვე";
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    let inputValue = `${selectedDate.getDate()}.${
      selectedDate.getMonth() + 1
    }.${selectedDate.getFullYear()}`;

    setDateValue(inputValue);
    setListings({
      ...listings,
      deadline: false,
    });
    setChosenDate(selectedDate);

    // to utc+4
    let dateValue = "";

    let date = null;
    // if user selects today it will sets deadline at 24:00 otherwise it does same but on the selected day
    if (isToday(selectedDate.getDate())) {
      date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    } else {
      date = selectedDate;
    }

    date.setUTCHours(date.getUTCHours() + 4);

    dateValue = date.toISOString().replace("Z", "+04:00");

    setValue("due_date", dateValue);

    localStorage.setItem("date", JSON.stringify(dateValue));
  };

  const handleCancel = (e) => {
    e.preventDefault();

    setListings({
      ...listings,
      deadline: false,
    });

    setSelectedDate(chosenDate);
  };

  const handleErrors = () => {
    if (!isSubmited) {
      setSubmited(true);
    }
  };

  const makeSubmit = (data) => {
    let description = "";
    if (data.description) {
      description = data.description;
    }

    // if deadline is not chosen it sets tomorrow
    const tomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    tomorrow.setUTCHours(tomorrow.getUTCHours() + 4);
    let due_date = tomorrow.toISOString().replace("Z", "+04:00");
    if (data.due_date) {
      due_date = data.due_date;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", description);
    formData.append("priority_id", data.priority_id);
    formData.append("status_id", data.status_id);
    formData.append("department_id", data.department_id);
    formData.append("employee_id", data.employee_id);
    formData.append("due_date", due_date);

    const createTask = async () => {
      const url = "https://momentum.redberryinternship.ge/api/tasks";
      const token = "9e6c9438-0bca-4337-a267-f9a7fd99f68b";
      try {
        const response = await axios.post(url, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        localStorage.removeItem("taskFormData");
        localStorage.removeItem("taskIds");
        localStorage.removeItem("date");
        navigate("/");
      } catch (error) {
        console.error("Error:", error);
      }
    };
    createTask();
  };

  return (
    <main className="flex flex-col gap-[25px]">
      <h1 className="text-[34px] text-[#212529] font-[600] leading-[41px]">
        შექმენი ახალი დავალება
      </h1>
      <form
        onSubmit={handleSubmit(makeSubmit)}
        className="form1 flex flex-col items-end gap-[155px] pt-[65px] pr-[368px] pb-[216px] pl-[55px] mb-[100px] rounded-[4px] border border-[0.3px] border-[#ddd2ff]"
      >
        <section className="flex gap-[155px]">
          <section className="flex flex-col gap-[57px]">
            <div className="flex flex-col gap-1">
              <label htmlFor="tilte" className="formlabels mt-[6px] mb-[2px]">
                სათაური*
              </label>
              <input
                {...register("name")}
                type="text"
                name="name"
                id="title"
                className={`${
                  errors.name ? "border-[#F93B1D]" : "border-[#dee2e6]"
                } forminputs border border-solid h-[45px] w-[550px]`}
              />
              <p className="flex flex-col gap-[2px]">
                <span
                  className={`${
                    !isSubmited
                      ? "text-[#6c757d]"
                      : errors.name &&
                        (errors.name.type == "min" ||
                          errors.name.type == "required")
                      ? "text-[#F93B1D]"
                      : "text-[#45A849]"
                  } formspans`}
                >
                  მინიმუმ 3 სიმბოლო
                </span>
                <span
                  className={`${
                    !isSubmited
                      ? "text-[#6c757d]"
                      : errors.name && errors.name.type == "max"
                      ? "text-[#F93B1D]"
                      : "text-[#45A849]"
                  } formspans`}
                >
                  მაქსიმუმ 255 სიმბოლო
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="description"
                className="formlabels mt-[6px] mb-[2px]"
              >
                აღწერა
              </label>
              <textarea
                {...register("description")}
                name="description"
                id="description"
                className={`${
                  errors.description ? "border-[#F93B1D]" : "border-[#dee2e6]"
                } forminputs border border-solid h-[133px] w-[550px] resize-none text-sm text-[#0D0F10]`}
              ></textarea>
              <p className="flex flex-col gap-[2px]">
                <span
                  className={`${
                    !isSubmited
                      ? "text-[#6c757d]"
                      : errors.description &&
                        errors.description.type == "minWords"
                      ? "text-[#F93B1D]"
                      : "text-[#45A849]"
                  } formspans`}
                >
                  მინიმუმ 4 სიტყვა
                </span>
                <span
                  className={`${
                    !isSubmited
                      ? "text-[#6c757d]"
                      : errors.description && errors.description.type == "max"
                      ? "text-[#F93B1D]"
                      : "text-[#45A849]"
                  } formspans`}
                >
                  მაქსიმუმ 255 სიმბოლო
                </span>
              </p>
            </div>
            <section className="flex items-center gap-8">
              <div className="relative">
                <div className="flex flex-col gap-[6px]">
                  <label htmlFor="status_id" className="formlabels mt-[6px]">
                    პრიორიტეტი*
                  </label>

                  <div
                    onClick={() => openList("priority")}
                    className={`${
                      listings.priority
                        ? "border-b-0 rounded-t-[5px] border-[#8338EC]"
                        : errors.priority_id
                        ? "rounded-[5px] border-[#F93B1D]"
                        : "rounded-[5px] border-[#dee2e6]"
                    } w-[259px] h-[46px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                  >
                    <div className="flex items-center gap-[6px]" id="priority">
                      <img
                        src={
                          ids.priority_id == 0
                            ? "https://momentum.redberryinternship.ge/storage/priority-icons/Medium.svg"
                            : useData["priorities"].find(
                                (e) => ids.priority_id == e.id
                              )?.icon
                        }
                        alt=""
                      />
                      <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                        {ids.priority_id == 0
                          ? "საშუალო"
                          : useData["priorities"].find(
                              (e) => ids.priority_id == e.id
                            )?.name}
                      </span>
                    </div>
                    {listings.priority ? (
                      <img src="./arrow-up-v.png" alt="" />
                    ) : (
                      <img src="./arrow-down-b.png" alt="" />
                    )}
                  </div>
                  <section
                    className={`${
                      listings.priority
                        ? "flex flex-col border-b border-r border-l rounded-b-[5px] border-[#8338EC]"
                        : "hidden"
                    } absolute w-full bg-[#fff] z-50 left-0 bottom-[1px] transform translate-y-full rounded-b-[5px]`}
                  >
                    {useData.priorities.map((e) => {
                      return (
                        <div
                          key={e.id}
                          onClick={() => handleLists("priority", e.id)}
                          className="w-[259px] h-[46px] flex items-center gap-[6px] p-[14px] cursor-pointer"
                        >
                          <img src={e.icon} alt="" />
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
                  <input
                    {...register("priority_id")}
                    type="text"
                    id="inputPriority"
                    className="hidden"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="flex flex-col gap-[6px]">
                  <label htmlFor="status_id" className="formlabels mt-[6px]">
                    სტატუსი*
                  </label>
                  <div
                    onClick={() => openList("status")}
                    className={`${
                      listings.status
                        ? "border-b-0 rounded-t-[5px] border-[#8338EC]"
                        : errors.status_id
                        ? "rounded-[5px] border-[#F93B1D]"
                        : "rounded-[5px] border-[#dee2e6]"
                    } w-[259px] h-[46px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                  >
                    <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                      {ids.status_id == 0
                        ? "დასაწყები"
                        : useData["statuses"].find((e) => ids.status_id == e.id)
                            ?.name}
                    </span>
                    {listings.status ? (
                      <img src="./arrow-up-v.png" alt="" />
                    ) : (
                      <img src="./arrow-down-b.png" alt="" />
                    )}
                  </div>
                  <section
                    className={`${
                      listings.status
                        ? "flex flex-col border-b border-r border-l rounded-b-[5px] border-[#8338EC]"
                        : "hidden"
                    } absolute w-full bg-[#fff] z-50 left-0 bottom-[1px] transform translate-y-full rounded-b-[5px]`}
                  >
                    {useData.statuses.map((e) => {
                      return (
                        <div
                          key={e.id}
                          onClick={() => handleLists("status", e.id)}
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
                  <input
                    {...register("status_id")}
                    type="text"
                    id="inputStatus"
                    className="hidden"
                  />
                </div>
              </div>
            </section>
          </section>
          <section className="flex flex-col gap-[93px]">
            <div className="relative">
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="status_id" className="formlabels mt-[6px]">
                  დეპარტამენტი*
                </label>
                <div
                  onClick={() => openList("department")}
                  className={`${
                    listings.department
                      ? "border-b-0 rounded-t-[5px] border-[#8338EC]"
                      : errors.department_id
                      ? "rounded-[5px] border-[#F93B1D]"
                      : "rounded-[5px] border-[#dee2e6]"
                  } w-[550px] h-[45px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                >
                  <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                    {ids.department_id == 0
                      ? "დიზააინის დეპარტამენტი"
                      : useData["departments"].find(
                          (e) => ids.department_id == e.id
                        )?.name}
                  </span>
                  {listings.department ? (
                    <img src="./arrow-up-v.png" alt="" />
                  ) : (
                    <img src="./arrow-down-b.png" alt="" />
                  )}
                </div>
                <section
                  className={`${
                    listings.department
                      ? "flex flex-col border-b border-r border-l rounded-b-[5px] border-[#8338EC]"
                      : "hidden"
                  } absolute w-full bg-[#fff] z-50 left-0 bottom-[1px] transform translate-y-full rounded-b-[5px]`}
                >
                  {useData.departments.map((e) => {
                    return (
                      <div
                        key={e.id}
                        onClick={() => handleLists("department", e.id)}
                        className="w-[550px] h-[45px] p-[14px] cursor-pointer"
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
                <input
                  {...register("department_id")}
                  type="text"
                  id="inputDepartment"
                  className="hidden"
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-col gap-[6px]">
                <label
                  htmlFor="status_id"
                  className={`${
                    ids.department_id == 0 ? "text-[#ADB5BD]" : ""
                  } text-base text-[#343a40] leading-[19px]mt-[6px] `}
                >
                  პასუხისმგებელი თანამშრომელი*
                </label>
                <div
                  onClick={
                    ids.department_id == 0
                      ? (e) => e.preventDefault()
                      : () => openList("employee")
                  }
                  className={`${
                    listings.employee
                      ? "border-b-0 rounded-t-[5px] border-[#8338EC]"
                      : errors.employee_id
                      ? "rounded-[5px] border-[#F93B1D]"
                      : "rounded-[5px] border-[#dee2e6]"
                  } w-[550px] h-[45px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                >
                  <div className="flex items-center gap-[6px]">
                    {ids.employee_id != 0 ? (
                      <img
                        src={
                          useData.employees.filter(
                            (e) => ids.employee_id == e.id
                          )[0]?.avatar
                        }
                        alt="avatar"
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      ""
                    )}
                    <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                      {ids.employee_id == 0
                        ? ""
                        : (() => {
                            const employee = useData.employees.find(
                              (e) => ids.employee_id == e.id
                            );
                            return employee
                              ? `${employee.name} ${employee.surname}`
                              : "";
                          })()}
                    </span>
                  </div>
                  {ids.department_id == 0 ? (
                    <img src="./arrow-down-g.png" alt="" />
                  ) : listings.employee ? (
                    <img src="./arrow-up-v.png" alt="" />
                  ) : (
                    <img src="./arrow-down-b.png" alt="" />
                  )}
                </div>
                <section
                  className={`${
                    listings.employee
                      ? "flex flex-col border-b border-r border-l rounded-b-[5px] border-[#8338EC]"
                      : "hidden"
                  } absolute w-full bg-[#fff] z-50 left-0 bottom-[1px] transform translate-y-full rounded-b-[5px]`}
                >
                  <div
                    className="flex items-center gap-2 p-[14px] text-base text-[#8338EC] font-normal leading-[19px] cursor-pointer"
                    onClick={handleNewEmployee}
                  >
                    <div className="w-[18px] h-[18px] flex items-center justify-center rounded-full border border-solid border-[#8338EC]">
                      +
                    </div>
                    <span>დაამატე თანამშრომელი</span>
                  </div>
                  {useData.employees
                    .filter((e) => e.department.id == ids.department_id)
                    .map((e) => {
                      return (
                        <div
                          key={e.id}
                          onClick={() => handleLists("employee", e.id)}
                          className="w-[550px] h-[45px] flex items-center pl-[14px] cursor-pointer"
                        >
                          <div className="flex items-center gap-[6px]">
                            <img
                              src={e.avatar}
                              alt="avatar"
                              className="w-7 h-7 rounded-full"
                            />
                            <span
                              id={e.id}
                              className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow"
                            >
                              {e.name} {e.surname}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </section>
                <input
                  {...register("employee_id")}
                  type="text"
                  id="inputEmployee"
                  // value={values.region}
                  className="hidden"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[6px] mt-[76px]">
              <label htmlFor="deadline" className="formlabels mt-[6px]">
                დედლაინი
              </label>
              <div className="relative w-[318px]">
                <div
                  className={`${
                    listings.deadline ? "border-[#8338EC]" : "border-[#dee2e6]"
                  } w-[318px] h-[45px] flex items-center gap-[6px] px-[14px] rounded-[5px] border border-solid `}
                >
                  <img
                    src="./Vector.png"
                    alt="date"
                    onClick={() => openList("deadline")}
                  />
                  <input
                    {...register("due_date")}
                    type="text"
                    id="deadline"
                    placeholder="DD/MM/YYYY"
                    value={dateValue}
                    readOnly
                    className="outline-none w-[268px] text-sm text-[#0d0f10] leading-[1.43] tracking-[-0.18px] placeholder:text-[adb5bd] plceholder:text-sm placeholder:leading-[20px] placeholer:tracking-[-0.18px]"
                  />
                </div>
                <div
                  className={`${
                    listings.deadline ? "flex" : "hidden"
                  } absolute bottom-[-4px] left-0 transform translate-y-full w-full h-[336px] flex-col items-center gap-[22px] p-4 bg-[#fff] deadline-shadow`}
                >
                  <div className="w-[286px] flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[13px] text-[#000] leading-[16px] font-bold">
                      {monthName(selectedDate.getMonth())}{" "}
                      {selectedDate.getFullYear()}
                      <img src="./Rectangle 4.png" alt="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src="./Arrow-up.png"
                        alt="next"
                        onClick={() => changeMonth("next")}
                        className="cursor-pointer"
                      />
                      <img
                        src="./Arrow-down.png"
                        alt="prev"
                        onClick={() => changeMonth("prev")}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  <section className="flex flex-col w-[224px] flex-grow">
                    <div className="flex">
                      <span className="deadline-spans">Su</span>
                      <span className="deadline-spans">Mo</span>
                      <span className="deadline-spans">Tu</span>
                      <span className="deadline-spans">We</span>
                      <span className="deadline-spans">Th</span>
                      <span className="deadline-spans">Fr</span>
                      <span className="deadline-spans">Sa</span>
                    </div>
                    <div className="flex flex-wrap">
                      {prevWDays.map((e) => {
                        return (
                          <button key={e} className="disabled" disabled>
                            {e}
                          </button>
                        );
                      })}
                      {Array.from(
                        { length: lastOfMonth.getDate() },
                        (_, index) => {
                          const day = index + 1;
                          // validations for deadline are set here
                          // it doesnt allow user to choose past dates
                          const past = new Date(
                            selectedDate.getFullYear(),
                            selectedDate.getMonth(),
                            day
                          );
                          const dayA = new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate()
                          );
                          let isPast = past < dayA;

                          return (
                            <button
                              key={index}
                              onClick={
                                isPast
                                  ? (e) => e.preventDefault()
                                  : (e) => setDate(e, day)
                              }
                              className={`${
                                isPast
                                  ? "normal hover:bg-[#F93B1D] text-[#0d0f10] hover:text-[#fff] hover:opacity-60"
                                  : selectedDate.getDate() === day
                                  ? "selected"
                                  : isToday(day)
                                  ? "normal border border-[#8338ec] hover:bg-[#8338ec] text-[#0d0f10] hover:text-[#fff] hover:opacity-60"
                                  : "normal hover:bg-[#8338ec] text-[#0d0f10] hover:text-[#fff] hover:opacity-60"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        }
                      )}
                      {nextWDays.map((e) => {
                        return (
                          <button key={e} className="disabled" disabled>
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                  <div className="w-[286px] flex items-center justify-between px-4 mt-auto">
                    <button
                      className="outline-none text-[13px] text-[#8338ec] leading-[16px] cursor-pointer"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="outline-none text-[13px] text-[#8338ec] leading-[16px] cursor-pointer"
                      onClick={handleApply}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
        <div className="flex items-center gap-6">
          <button
            className="w-[120px] h-[42px] flex items-center justify-center rounded-[5px] border border-solid border-[#8338ec] text-base text-[#212529] cursor-pointer hover:border-[#B588F4]"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            გაუქმება
          </button>
          <button
            type="submit"
            onClick={handleErrors}
            className="w-[208px] h-[42px] rounded-[5px] bg-[#8338ec] text-[#fff] text-lg cursor-pointer hover:bg-[#B588F4]"
          >
            დავალების შექმნა
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateTask;
