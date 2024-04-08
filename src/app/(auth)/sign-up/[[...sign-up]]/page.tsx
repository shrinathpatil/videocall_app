import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign-Up Page",
  description: "you need to sign up to use this video call application",
};

const Page = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </div>
  );
};

export default Page;
