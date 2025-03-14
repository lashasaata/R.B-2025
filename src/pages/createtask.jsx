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

  const makeSubmit = () => {};
  return (
    <main className="flex flex-col gap-[25px]">
      <h1 className="text-[34px] text-[#212529] font-[600] leading-[41px]">
        შექმენი ახალი დავალება
      </h1>
      <form
        onSubmit={handleSubmit(makeSubmit)}
        className="form1 flex flex-col items-end gap-[155px] pt-[65px] pr-[368px] pb-[216px] pl-[55px] mb-[100px] rounded-[4px] border border-solid border-[#ddd2ff]"
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
                className="forminputs h-[45px] w-[550px]"
              />
              <p className="flex flex-col gap-[2px]">
                <span className="formspans">მინიმუმ 3 სიმბოლო</span>
                <span className="formspans">მაქსიმუმ 255 სიმბოლო</span>
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
                className="forminputs h-[133px] w-[550px] resize-none text-sm text-[#0D0F10]"
              ></textarea>
              <p className="flex flex-col gap-[2px]">
                <span className="formspans">მინიმუმ 4 სიტყვა</span>
                <span className="formspans">მაქსიმუმ 255 სიმბოლო</span>
              </p>
            </div>
            <section className="flex items-center gap-8">
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="priority" className="formlabels mt-[6px]">
                  პრიორიტეტი*
                </label>
                <select
                  name="priority"
                  id="priority"
                  className="forminputs h-[45px] w-[259px] appearance-none"
                ></select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="status" className="formlabels mt-[6px]">
                  სტატუსი
                </label>
                <select
                  name="status"
                  id="status"
                  className="forminputs h-[45px] w-[259px] appearance-none"
                ></select>
              </div>
            </section>
          </section>
          <section className="flex flex-col gap-[61px]">
            <div className="flex flex-col gap-[6px] mb-8">
              <label htmlFor="department" className="formlabels mt-[6px]">
                დეპარტამენტი*
              </label>
              <select
                name="department"
                id="department"
                className="forminputs appearance-none w-[550px] h-[45px]"
              ></select>
            </div>
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="employee" className="formlabels mt-[6px]">
                პასუხისმგებელი თანამშრომელი*
              </label>
              <select
                name="employee"
                id="employee"
                className="forminputs appearance-none w-[550px] h-[45px]"
              ></select>
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
