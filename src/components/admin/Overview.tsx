import Image from "next/image";

interface CardStatsProps {
  title: string;
  subtitle: string;
  value: string;
  icon: string;
}

const CardStats: React.FC<CardStatsProps> = ({
  title,
  subtitle,
  value,
  icon,
}) => {
  return (
    <div className="bg-white shadow-lg flex justify-between rounded-xl px-5 py-7">
      <div className="w-full">
        <h2 className="text-5xl font-bold text-sky-700">{value}</h2>
        <h3 className="text-2xl font-semibold text-sky-700">{title}</h3>
        <h4 className="text-md text-slate-400">{subtitle}</h4>
      </div>
      <div className="self-end w-full flex justify-end">
        <Image width={100} height={100} src={icon} alt={icon} />
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  return (
    <>
      {/* <h1 className="mb-10 font-bold text-3xl">Dashboard</h1> */}
      <div className="grid md:grid-cols-3 gap-5">
        <CardStats
          title="Tricycle"
          subtitle="Total Registered"
          value="20"
          icon="/overview-icons/tricycle.png"
        />
        <CardStats
          title="Operators"
          subtitle="Total Registered"
          value="20"
          icon="/overview-icons/operator.png"
        />
        <CardStats
          title="Drivers"
          subtitle="Total Registered"
          value="20"
          icon="/overview-icons/driver.png"
        />
        <CardStats
          title="Application"
          subtitle="Total Application"
          value="21"
          icon="/overview-icons/profiles.png"
        />
        <CardStats
          title="Reports"
          subtitle="Total Reports Violations"
          value="13"
          icon="/overview-icons/seo-report.png"
        />
        <CardStats
          title="Collection"
          subtitle="Total Collection"
          value="63,000"
          icon="/overview-icons/data-collection.png"
        />
      </div>
    </>
  );
};

export default Overview;
