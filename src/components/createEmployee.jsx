function CreateEmployee() {
  return (
    <div className=" absolute fixed inset-0 backdrop-blur-[10px] z-20">
      <main className="w-[913px] rounded-[10px] bg-[#fff] mt-[118px] ml-[580px]">
        <div>
          <div>
            <img src="./Cancel.png" alt="cancle" />
          </div>
        </div>
        <form>
          <h1>თანამშრომლის დამატება</h1>
          <section>
            <label htmlFor="name">სახელი*</label>
            <input type="text" id="name" />
            <div>
              <p>
                <img src="./check.png" alt="check" />
                <span>მინიმუმ 2 სიმბოლო</span>
              </p>
              <p>
                <img src="./check.png" alt="check" />
                <span>მინიმუმ 255 სიმბოლო</span>
              </p>
            </div>
          </section>
          <section>
            <label htmlFor="name">სახელი*</label>
            <input type="text" id="name" />
            <div>
              <p>
                <img src="./check.png" alt="check" />
                <span>მინიმუმ 2 სიმბოლო</span>
              </p>
              <p>
                <img src="./check.png" alt="check" />
                <span>მინიმუმ 255 სიმბოლო</span>
              </p>
            </div>
          </section>
          <div>
            <span>ავატარი*</span>
            <div>
              <div className="hidden">
                <img src="" alt="" />
                <div>
                  <img src="./trash-2.png" alt="delete" />
                </div>
              </div>
              <label htmlFor="image_upload">
                <div>
                  <img src="./gallery-export.png" alt="export" />
                  <span>ატვირთე ფოტო</span>
                </div>
              </label>
            </div>
            <input type="file" name="" id="image_upload" />
          </div>
          <div>
            <label htmlFor="department1">დეპარტამენტი*</label>
            <select name="" id="department1"></select>
          </div>
          <div>
            <button>გაუქმება</button>
            <button>დაამატე თანამშრომელი</button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Slicer;
