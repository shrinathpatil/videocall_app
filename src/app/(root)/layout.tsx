import "@/app/globals.css";
import StreamVideoProvider from "@/providers/StreamVideoProvider";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Video Call App",
  description: "this is video call app maded using nextjs",
  icons: {
    icon: "/icons/logo.svg",
  },
};
const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default Layout;
