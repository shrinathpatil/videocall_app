import { SignIn } from "@clerk/nextjs";

export const metadata = {
  title: "Sign-In Page",
  description: "you need to sign in to use this video call application",
};

const Page = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
};

export default Page;
