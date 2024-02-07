import Image from "next/image";

const TopbarFloat = () => {
  return (
    <div className="w-full flex flex-col gap-1 mt-3 px-1">
      {/* bg-[#171A20] */}
      <div className="rounded-full justify-between items-center gap-2 flex p-2">
        <div className="flex items-center justify-center font-bold gap-2 text-lg">
          <Image src="/logo.svg" alt="Traffico Logo" width={45} height={45} />
          <h2>Traffico</h2>
        </div>
      </div>
    </div>
  );
};

export default TopbarFloat;
