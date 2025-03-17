function Home() {
  return (
    <main className="flex flex-col gap-[52px]">
      <h1 className="text-[34px] text-[#212529] font-[600] leading-[41px]">
        დავალებების გვერდი
      </h1>
      <section className="w-[688px] flex items-center gap-[45px] rounded-[10px] border border-[#dee2e6]">
        <div className="w-[199px] flex items-center gap-2 py-[10px] pl-[18px]">
          <span className="text-base text-[#0d0f10] leading-[19px]">
            დეპარტამენტი
          </span>
          <img src="./Icon.png" alt="open" />
        </div>
        <div className="w-[199px] flex items-center gap-2 py-[10px] pl-[18px]">
          <span className="text-base text-[#0d0f10] leading-[19px]">
            პრიორიტეტი
          </span>
          <img src="./Icon.png" alt="open" />
        </div>
        <div className=" w-[199px] flex items-center gap-2 py-[10px] pl-[18px]">
          <span className="text-base text-[#0d0f10] leading-[19px]">
            თანამშრომელი
          </span>
          <img src="./Icon.png" alt="open" />
        </div>
      </section>
      <section></section>
    </main>
  );
}

export default Home;
