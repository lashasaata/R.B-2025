function CreateEmployee() {
  return (
    <div className="fixed bg-black inset-0 backdrop-blur-[5px]">
      <main className="w-[913px] rounded-[10px] bg-[#fff] flex flex-col gap-[37px] mt-[118px] ml-[580px] px-[50px] pt-10 pb-15">
        <div className="flex justify-end">
          <div>
            <img src="./Cancel.png" alt="cancle" />
          </div>
        </div>
        <form className="flex flex-col gap-[45px]">
          <h1 className="text-[32px] text-[#212529] font-bold leading-[38px] text-center">
            თანამშრომლის დამატება
          </h1>
          <div className="flex items-center gap-[45px]">
            <section className="flex flex-col gap-[3px]">
              <label htmlFor="name" className="form2labels">
                სახელი*
              </label>
              <input type="text" id="name" className="form2inputs" />
              <div className="flex flex-col gap-[2px] mt-[3px]">
                <p className="flex items-center gap-[2px]">
                  <img src="./check.png" alt="check" />
                  <span className="form2spans">მინიმუმ 2 სიმბოლო</span>
                </p>
                <p className="flex items-center gap-[2px]">
                  <img src="./check.png" alt="check" />
                  <span className="form2spans">მინიმუმ 255 სიმბოლო</span>
                </p>
              </div>
            </section>
            <section>
              <label htmlFor="lastname" className="form2labels">
                გვარი*
              </label>
              <input type="text" id="lastname" className="form2inputs" />
              <div className="flex flex-col gap-[2px] mt-[3px]">
                <p className="flex items-center gap-[2px]">
                  <img src="./check.png" alt="check" />
                  <span className="form2spans">მინიმუმ 2 სიმბოლო</span>
                </p>
                <p className="flex items-center gap-[2px]">
                  <img src="./check.png" alt="check" />
                  <span className="form2spans">მინიმუმ 255 სიმბოლო</span>
                </p>
              </div>
            </section>
          </div>
          <div className="flex flex-col gap-2">
            <span className="form2labels">ავატარი*</span>
            <div className="w-full h-[120px] flex justify-center items-center rounded-[8px] border border-dashed border-[#ced4da] bg-[#fff]">
              <div className="hidden">
                <img src="" alt="" />
                <div>
                  <img src="./trash-2.png" alt="delete" />
                </div>
              </div>
              <label
                htmlFor="image_upload"
                className="form2labels w-full h-full pt-[50px]"
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
            <input type="file" name="" id="image_upload" className="hidden" />
          </div>
          <div className="flex flex-col gap-[3px]">
            <label htmlFor="department1" className="form2labels">
              დეპარტამენტი*
            </label>
            <select name="" id="department1" className="form2inputs"></select>
          </div>
          <div className="flex justify-end gap-[22px]">
            <button className="w-[102px] h-[42px] flex items-center justify-center rounded-[5px] border border-solid border-[#8338ec] text-base text-[#212529] cursor-pointer hover:border-[#B588F4]">
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
