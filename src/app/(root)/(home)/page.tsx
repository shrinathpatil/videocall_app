import MeetingTypeList from "@/components/MeetingTypeList";

const Page = () => {
  const getDate = () => {
    let date = new Date();
    let time = date.toLocaleTimeString().split(" ")[0].substring(0, 5);
    let greet = date.toLocaleTimeString().split(" ")[1];
    let todays = date.toDateString().split(" ");
    let todayDate = `${todays[0]}, ${todays[1]} ${todays[2]}, ${todays[3]}`;
    return {
      time,
      greet,
      today: todayDate,
    };
  };
  return (
    <section className="flex flex-col size-full gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
            Upcoming Meeting at 11:00 AM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl uppercase">
              {getDate().time} {getDate().greet}
            </h1>
            <p className="text-lg font-medium text-sky-1 md:text-2xl">
              {getDate().today}
            </p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Page;
