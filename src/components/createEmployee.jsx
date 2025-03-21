import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { Listbox } from "@headlessui/react";

const FILE_SIZE = 600 * 1024; // 600 KB
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/svg"];

const schema = yup.object().shape({
  name: yup
    .string()
    .required("სავალდებულო")
    .matches(/^[a-zA-Zა-ჰ]+$/, "მხოლოდ ქართული და ლათინური ასოები!")
    .min(2, " მინიმუმ 2 სიმბოლო")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),
  surname: yup
    .string()
    .required("სავალდებულო")
    .matches(/^[a-zA-Zა-ჰ]+$/, "მხოლოდ ქართული და ლათინური ასოები!")
    .min(2, " მინიმუმ 2 სიმბოლო")
    .max(255, "მაქსიმუმ 255 სიმბოლო"),
  avatar: yup
    .mixed()
    .test("fileRequired", "ფოტო სავალდებულოა", (value) => {
      // return value && value.length > 0;
      return value instanceof File;
    })
    .test("fileSize", "მაქსიმუმ 600kb ზომაში", (value) => {
      return value.size <= FILE_SIZE;
    })
    .test("fileFormat", "უნდა იყოს სურათის ტიპის", (value) => {
      return SUPPORTED_FORMATS.includes(value.type);
    }),

  department_id: yup.string().required(),
});

function CreateEmployee(props) {
  const navigate = useNavigate();
  const depUrl = "https://momentum.redberryinternship.ge/api/departments";
  const emplUrl = "https://momentum.redberryinternship.ge/api/employees";
  const token = "9e6c9438-0bca-4337-a267-f9a7fd99f68b";
  const [fileA, setFileA] = useState("");
  const [fileAUrl, setFileAUrl] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departments = await axios.get(depUrl);
        setDepartments(departments.data);
      } catch (error) {
        console.log("Fetching error:", error);
      }
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmt = (data) => {
    const depId = departments.find((e) => e.name === data.department_id).id;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("surname", data.surname);
    formData.append("avatar", fileA);
    formData.append("department_id", depId);

    const postData = async () => {
      try {
        const response = await axios.post(emplUrl, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });
        props.setSlicer(false);
      } catch (error) {
        console.log("Error posting data:", error);
      }
    };
    postData();
  };

  const inputs = watch();

  const handleFileA = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFileA(selectedFile);
    setFileAUrl(URL.createObjectURL(selectedFile));
    setValue("avatar", selectedFile, { shouldValidate: true });

    reader.readAsDataURL(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    if (url) {
      setFileAUrl(url);
    }
    setValue("avatar", selectedFile, { shouldValidate: true });
  };

  const handleClearFileA = () => {
    setFileA("");
    setFileAUrl("");
    setValue("avatar", "", { shouldValidate: false });
  };

  const [selected, setSelected] = useState(null);

  const handleChange = (e) => {
    setSelected(e);
    setValue("department_id", e, { shouldValidate: true }); // Update form
  };

  const [isOpen, setOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="absolute inset-0 blur"
        onClick={() => props.setSlicer(false)}
      ></div>
      <main className="relative w-[913px] rounded-[10px] bg-[#fff] flex flex-col gap-[37px] mt-[118px] ml-[580px] px-[50px] pt-10 pb-15">
        <div className="flex justify-end">
          <div>
            <img
              src="./Cancel.png"
              alt="cancle"
              className="cursor-pointer"
              onClick={() => {
                props.setSlicer(false);
              }}
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmt)}
          className="flex flex-col gap-[45px]"
        >
          <h1 className="text-[32px] text-[#212529] font-bold leading-[38px] text-center">
            თანამშრომლის დამატება
          </h1>
          <div className="flex items-center gap-[45px]">
            <section className="h-[102px] flex flex-col gap-[3px]">
              <label htmlFor="name" className="form2labels">
                სახელი*
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className={`${
                  errors.name ? "border-[#F93B1D]" : "border-[#808a93]"
                } form2inputs border border-solid`}
              />
              <div className="flex flex-col gap-[2px] mt-[3px]">
                {errors.name && errors.name.type == "matches" ? (
                  <span className="flex items-center gap-[2px] text-[10px] text-[#FA4D4D] leading-[12px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill={`${
                        !(Object.keys(errors).length >= 1)
                          ? "#6C757D"
                          : errors.name && errors.name.type == "matches"
                          ? "#F93B1D"
                          : "#45A849"
                      }`}
                      className="bi bi-check-lg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                    </svg>
                    {errors.name && errors.name.type == "matches"
                      ? errors.name.message
                      : ""}
                  </span>
                ) : (
                  <div className="flex flex-col gap-[2px] mt-[3px]">
                    <p className="flex items-center gap-[2px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill={`${
                          !(Object.keys(errors).length >= 1)
                            ? "#6C757D"
                            : errors.name &&
                              (errors.name.type == "min" ||
                                errors.name?.type == "required")
                            ? "#F93B1D"
                            : "#45A849"
                        }`}
                        className="bi bi-check-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>
                      <span
                        className={`${
                          !(Object.keys(errors).length >= 1)
                            ? "text-[#6c757d]"
                            : errors.name &&
                              (errors.name.type == "min" ||
                                errors.name.type == "required")
                            ? "text-[#F93B1D]"
                            : "text-[#45A849]"
                        } form2spans`}
                      >
                        მინიმუმ 2 სიმბოლო
                      </span>
                    </p>
                    <p className="flex items-center gap-[2px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill={`${
                          !(Object.keys(errors).length >= 1)
                            ? "#6C757D"
                            : errors.name && errors.name.type == "max"
                            ? "#F93B1D"
                            : "#45A849"
                        }`}
                        className="bi bi-check-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>
                      <span
                        className={`${
                          !(Object.keys(errors).length >= 1)
                            ? "text-[#6c757d]"
                            : errors.name && errors.name.type == "max"
                            ? "text-[#F93B1D]"
                            : "text-[#45A849]"
                        } form2spans`}
                      >
                        მაქსიმუმ 255 სიმბოლო
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </section>
            <section className="h-[102px] flex flex-col gap-[3px]">
              <label htmlFor="surname" className="form2labels">
                გვარი*
              </label>
              <input
                {...register("surname")}
                type="text"
                id="surname"
                className={`${
                  errors.surname ? "border-[#F93B1D]" : "border-[#808a93]"
                } form2inputs border border-solid`}
              />
              <div className="flex flex-col gap-[2px] mt-[3px]">
                {errors.surname && errors.surname.type == "matches" ? (
                  <span className="flex items-center gap-[2px] text-[10px] text-[#FA4D4D] leading-[12px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill={`${
                        !(Object.keys(errors).length >= 1)
                          ? "#6C757D"
                          : errors.surname && errors.surname.type == "matches"
                          ? "#F93B1D"
                          : "#45A849"
                      }`}
                      className="bi bi-check-lg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                    </svg>
                    {errors.surname && errors.surname.type == "matches"
                      ? errors.surname.message
                      : ""}
                  </span>
                ) : (
                  <div className="flex flex-col gap-[2px] mt-[3px]">
                    <p className="flex items-center gap-[2px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill={`${
                          !(Object.keys(errors).length >= 1)
                            ? "#6C757D"
                            : errors.surname &&
                              (errors.surname.type == "min" ||
                                errors.surname?.type == "required")
                            ? "#F93B1D"
                            : "#45A849"
                        }`}
                        className="bi bi-check-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>
                      <span
                        className={`${
                          !(Object.keys(errors).length >= 1)
                            ? "text-[#6c757d]"
                            : errors.surname &&
                              (errors.surname.type == "min" ||
                                errors.surname.type == "required")
                            ? "text-[#F93B1D]"
                            : "text-[#45A849]"
                        } form2spans`}
                      >
                        მინიმუმ 2 სიმბოლო
                      </span>
                    </p>
                    <p className="flex items-center gap-[2px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill={`${
                          !(Object.keys(errors).length >= 1)
                            ? "#6C757D"
                            : errors.surname && errors.surname.type == "max"
                            ? "#F93B1D"
                            : "#45A849"
                        }`}
                        className="bi bi-check-lg"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                      </svg>
                      <span
                        className={`${
                          !(Object.keys(errors).length >= 1)
                            ? "text-[#6c757d]"
                            : errors.surname && errors.surname.type == "max"
                            ? "text-[#F93B1D]"
                            : "text-[#45A849]"
                        } form2spans`}
                      >
                        მაქსიმუმ 255 სიმბოლო
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="h-[161px] flex flex-col gap-2">
            <span className="form2labels">ავატარი*</span>
            <div
              className={`${
                errors.avatar ? "border-[#F93B1D]" : "border-[#ced4da]"
              } w-full h-[120px] flex justify-center items-center rounded-[8px] border border-dashed bg-[#fff]`}
            >
              <div className={fileAUrl ? "flex relative" : "hidden"}>
                {fileAUrl ? (
                  <img
                    src={fileAUrl}
                    alt="avatar"
                    className="w-[88px] h-[88px] rounded-full"
                  />
                ) : (
                  ""
                )}
                <div className="absolute bottom-[-3px] right-[-3px] flex items-center justify-center w-6 h-6 rounded-full border border-solid border-[#6C757D] bg-[#fff] cursor-pointer">
                  <img
                    src="./trash-2.png"
                    alt="delete"
                    className="w-[14px] h-[14px]"
                    onClick={handleClearFileA}
                  />
                </div>
              </div>
              <label
                htmlFor="avatar"
                className={`${
                  fileAUrl ? "hidden" : "flex justify-center"
                } form2labels w-full h-full pt-[50px]`}
              >
                <div className="flex flex-col items-center gap-[5px]">
                  <div>
                    <img src="./gallery-export.png" alt="export" />
                  </div>
                  <span className="text-sm text-[#0D0F10] leading-[17px]">
                    ატვირთე ფოტო
                  </span>
                </div>
              </label>
            </div>
            <span
              className={`${
                errors.avatar?.type != "fileRequired" ? "flex" : "hidden"
              } items-center gap-[2px] text-[10px] text-[#FA4D4D] leading-[12px] mt-[-4px]`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill={"#F93B1D"}
                className={`${
                  errors.avatar && errors.avatar.type != "fileRequired"
                    ? "flex"
                    : "hidden"
                } bi bi-check-lg`}
                viewBox="0 0 16 16"
              >
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
              </svg>
              {errors.avatar?.message}
            </span>
            <input
              {...register("avatar")}
              type="file"
              accept="image/*"
              name=""
              id="avatar"
              className="hidden"
              onChange={handleFileA}
            />
          </div>
          <Listbox value={selected ? selected : ""} onChange={handleChange}>
            <div className="relative w-[384px]">
              <span className="form2labels mb-[3px]">დეპარტამენტი*</span>
              {/* Select Button */}
              <Listbox.Button
                onClick={() => setOpen(!isOpen)}
                className={`${
                  isOpen
                    ? "border-b-0 border-[#CED4DA]"
                    : errors.department_id
                    ? "border-[#F93B1D]"
                    : "border-[#CED4DA]"
                } relative w-full h-[42px] flex justify-between rounded-[6px] p-[10px] border  focus:outline-none`}
              >
                <span className="text-left text-sm text-[#000000] leading-[17px]">
                  {selected}
                </span>
                <div className="flex items-center justify-center">
                  {isOpen ? (
                    <img
                      width="13"
                      height="14"
                      src="https://img.icons8.com/material-rounded/24/chevron-up.png"
                      alt="chevron-up"
                    />
                  ) : (
                    <img
                      src="./icon-arrow-down.svg"
                      alt=""
                      className="relative"
                    />
                  )}
                </div>
              </Listbox.Button>

              {/* Dropdown Options */}
              <Listbox.Options className="absolute left-0 w-full max-h-[120px] overflow-auto bg-[#fff] border border-[#CED4DA] rounded-[6px] z-10">
                {departments.map((e) => (
                  <Listbox.Option
                    key={e.id}
                    value={e.name}
                    disabled={e.disabled}
                    onClick={() => setOpen(false)}
                    className={({ active }) =>
                      `cursor-pointer select-none p-[10px] ${
                        active
                          ? "bg-white text-sm text-[#212529] leading-[17px]"
                          : "bg-white text-sm text-[#212529] leading-[17px]"
                      } ${e.disabled ? "opacity-50 cursor-not-allowed" : ""}`
                    }
                  >
                    {e.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
          <div className="flex justify-end gap-[22px]">
            <button
              className="w-[102px] h-[42px] flex items-center justify-center rounded-[5px] border border-solid border-[#8338ec] text-base text-[#212529] cursor-pointer hover:border-[#B588F4]
            "
              onClick={(e) => {
                e.preventDefault;
                props.setSlicer(false);
              }}
            >
              გაუქმება
            </button>
            <button
              type="submit"
              className="w-[263px] h-[42px] rounded-[5px] bg-[#8338ec] text-base text-[#fff] flex items-center justify-center cursor-pointer hover:bg-[#B588F4]"
            >
              დაამატე თანამშრომელი
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateEmployee;
