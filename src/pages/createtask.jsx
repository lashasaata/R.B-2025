function CreateTask() {
  return (
    <main>
      <h1>შექმენი ახალი დავალება</h1>
      <form>
        <section>
          <div>
            <label htmlFor="tilte">სათაური*</label>
            <input type="text" name="" id="title" />
            <p>
              <span>მინიმუმ 2 სიმბოლო</span>
              <span>მაქსიმუმ 255 სიმბოლო</span>
            </p>
          </div>
          <div>
            <label htmlFor="description">აღწერა</label>
            <textarea name="" id="description"></textarea>
            <p>
              <span>მინიმუმ 2 სიმბოლო</span>
              <span>მაქსიმუმ 255 სიმბოლო</span>
            </p>
          </div>
          <section>
            <div>
              <label htmlFor="priority">პრიორიტეტი*</label>
              <select name="" id="priority"></select>
            </div>
            <div>
              <label htmlFor="status">სტატუსი</label>
              <select name="" id="status"></select>
            </div>
          </section>
        </section>
        <section>
          <div>
            <label htmlFor="department">დეპარტამენტი*</label>
            <select name="" id="department"></select>
          </div>
          <div>
            <label htmlFor="employee">პასუხისმგებელი თანამშრომელი*</label>
            <select name="" id="employee"></select>
          </div>
          <div>
            <label htmlFor="deadline">დედლაინი</label>
            <input type="datetime" name="" id="deadline" />
          </div>
        </section>
        <div>
          <button>გაუქმება</button>
          <button type="submit">დავალების შექმნა</button>
        </div>
      </form>
    </main>
  );
}

export default CreateTask;
