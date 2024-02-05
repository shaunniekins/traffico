import Image from "next/image";

const TopbarFloat = () => {
  return (
    <div className="w-full flex flex-col gap-1 p-2">
      <div className="bg-[#171A20] rounded-full justify-between items-center gap-2 flex p-2">
        <button>
          <Image src="/logo.svg" alt="Traffico Logo" width={40} height={40} />
        </button>
      </div>
    </div>
  );
};

export default TopbarFloat;
