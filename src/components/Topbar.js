import { IoMenuOutline, IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const Topbar = () => {
  return (
    <div className="flex justify-between items-center py-2 h-[5dvh]">
      <button
        className="text-3xl self-end"
        // onClick={() => {
        //   setIsMenuOpen(!isMenuOpen);
        // }}
      >
        <IoMenuOutline />
      </button>
      <div className="flex pr-5 items-center space-x-4">
        <button className="flex items-center text-2xl space-x-2">
          <CgProfile />
          <h5 className="text-xl">Admin</h5>
        </button>
        <button className="text-2xl">
          <IoSettingsOutline />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
