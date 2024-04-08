"use client";
import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";
import { useToast } from "@/components/ui/use-toast";
import { meetingTypeList } from "@/constants";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
type Value = {
  dateTime: Date;
  description: string;
  link: string;
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();
  const [values, setValues] = useState<Value>({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const { toast } = useToast();
  const meetingFunctions = [
    () => setMeetingState("isInstantMeeting"),
    () => setMeetingState("isScheduleMeeting"),
    () => router.push("/recordings"),
    () => setMeetingState("isJoiningMeeting"),
  ];

  const { user } = useUser();
  const client = useStreamVideoClient();
  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time!",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create Call!");

      const starstAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();

      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: starstAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Meeting Created!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting!",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {meetingTypeList.map((meetType, index) => (
        <HomeCard
          key={meetType.heading}
          handleClick={meetingFunctions[index]}
          {...meetType}
        />
      ))}
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
          buttonText="Schedule Meeting"
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="desc"
              className="text-base text-normal leading-[22px] text-sky-2"
            >
              Add a Description
            </label>
            <Textarea
              id="desc"
              className="resize-none border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="datepicker"
              className="text-base text-normal leading-[22px] text-sky-2"
            >
              Select Date and Time
            </label>
            <ReactDatePicker
              id="datepicker"
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none cursor-pointer"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Paste Link Here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values?.link)}
      >
        <Input
          type="text"
          placeholder="Meeting Link"
          className="border border-gray-600 w-full rounded-md p-2 text-sky-2 bg-dark-3 outline-none focus:border-blue-1 transition focus:ring-blue-1"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          value={values.link}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
