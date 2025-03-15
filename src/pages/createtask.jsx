import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Description } from "@headlessui/react";

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
});

function CreateTask() {
  const token = "9e6c9438-0bca-4337-a267-f9a7fd99f68b";
  const apiUrl = (endpoint) =>
    `https://momentum.redberryinternship.ge/api/${endpoint}`;
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
  }, []);

  console.log(useData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const inputs = watch();
  console.log(inputs, errors);

  const [listings, setListings] = useState({
    status: false,
    priority: false,
    department: false,
    employee: false,
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
      [listType]: !prevListings[listType],
    }));
  };

  const handleLists = (listType, id) => {
    setIds((prevIds) => ({
      ...prevIds,
      [`${listType}_id`]: id,
    }));

    setListings((prevListings) => ({
      ...prevListings,
      [listType]: false,
    }));
  };

  console.log(listings);

  const makeSubmit = () => {};

  const handleErrors = () => {
    console.log(isSubmited);
    if (!isSubmited) {
      setSubmited(true);
    }
  };
  // console.log(useData["priorities"].find((e) => 3 == e.id).name);
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
                        : errors.priority
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
                              ).icon
                        }
                        alt=""
                      />
                      <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                        {ids.priority_id == 0
                          ? "საშუალო"
                          : useData["priorities"].find(
                              (e) => ids.priority_id == e.id
                            ).name}
                      </span>
                    </div>
                    <img src="/icon-arrow-down.svg" alt="down" />
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
                    // value={values.region}
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
                        : errors.status
                        ? "rounded-[5px] border-[#F93B1D]"
                        : "rounded-[5px] border-[#dee2e6]"
                    } w-[259px] h-[46px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                  >
                    <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                      {ids.status_id == 0
                        ? "დასაწყები"
                        : useData["statuses"].find((e) => ids.status_id == e.id)
                            .name}
                    </span>
                    <img src="/icon-arrow-down.svg" alt="down" />
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
                    // value={values.region}
                    className="hidden"
                  />
                </div>
              </div>
            </section>
          </section>
          <section className="flex flex-col gap-[61px]">
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
                      : errors.department
                      ? "rounded-[5px] border-[#F93B1D]"
                      : "rounded-[5px] border-[#dee2e6]"
                  } w-[550px] h-[45px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                >
                  <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                    {ids.department_id == 0
                      ? "დიზააინის დეპარტამენტი"
                      : useData["departments"].find(
                          (e) => ids.department_id == e.id
                        ).name}
                  </span>
                  <img src="/icon-arrow-down.svg" alt="down" />
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
                  // value={values.region}
                  className="hidden"
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="status_id" className="formlabels mt-[6px]">
                  პასუხისმგებელი თანამშრომელი*
                </label>
                <div
                  onClick={() => openList("employee")}
                  className={`${
                    listings.employee
                      ? "border-b-0 rounded-t-[5px] border-[#8338EC]"
                      : errors.employee
                      ? "rounded-[5px] border-[#F93B1D]"
                      : "rounded-[5px] border-[#dee2e6]"
                  } w-[550px] h-[45px] p-[14px] border border-solid  flex items-center justify-between relative cursor-pointer`}
                >
                  <span className="text-sm text-[#0d0f10] font-[300] leading-[17px] grow">
                    {ids.employee_id == 0
                      ? "დიზააინის დეპარტამენტი"
                      : useData["employees"].find(
                          (e) => ids.employee_id == e.id
                        ).name}
                  </span>
                  <img src="/icon-arrow-down.svg" alt="down" />
                </div>
                <section
                  className={`${
                    listings.employee
                      ? "flex flex-col border-b border-r border-l rounded-b-[5px] border-[#8338EC]"
                      : "hidden"
                  } absolute w-full bg-[#fff] z-50 left-0 bottom-[1px] transform translate-y-full rounded-b-[5px]`}
                >
                  <div className="flex items-center gap-2 p-[14px] text-base text-[#8338EC] font-normal leading-[19px]">
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
            <div className="flex flex-col gap-[6px] mt-[108px]">
              <label htmlFor="deadline" className="formlabels mt-[6px]">
                დედლაინი
              </label>
              <input
                type="date"
                name=""
                id="deadline"
                className="forminputs w-[318px] h-[45px] text-sm text-[#0D0F10] text-[#ADB5BD]"
              />
            </div>
          </section>
        </section>
        <div className="flex items-center gap-6">
          <button className="w-[120px] h-[42px] flex items-center justify-center rounded-[5px] border border-solid border-[#8338ec] text-base text-[#212529] cursor-pointer hover:border-[#B588F4]">
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
