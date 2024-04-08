import CallList from "@/components/CallList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Call App - Previous",
  description: "this is video call app maded using nextjs",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const Page = () => {
  return (
    <section className="flex flex-col size-full gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous</h1>
      <CallList type="ended" />
    </section>
  );
};

export default Page;
