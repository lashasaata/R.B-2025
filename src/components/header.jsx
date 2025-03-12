import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <header className="h-[100px] flex items-center justify-between">
      <aside className="flex items-center gap-1">
        <span className="text-[31px] text-[#8338ec] font-bold">Momentum</span>
        <img src="./Hourglass.png" alt="sand timer" />
      </aside>
      <nav className="flex items-center gap-10">
        <button className="w-[225px] h-[39px] flex items-center justify-center rounded-[5px] border border-solid border-[#8338ec] text-base text-[#212529] cursor-pointer hover:border-[#B588F4]">
          თანამშრომლის შექმნა
        </button>
        <button
          className="w-[268px] h-10 rounded-[5px] bg-[#8338ec] flex items-center justify-center gap-1 cursor-pointer hover:bg-[#B588F4]"
          onClick={() => navigate("/create_task")}
        >
          <img src="./add.png" alt="add" />
          <span className="text-base text-[#fff]">შექმენი ახალი დავალება</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;
