//@ts-nocheck
"use client";
import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";

type Props = {
  type: "ended" | "upcoming" | "recording";
};

const CallList = ({ type }: Props) => {
  const { endedCalls, isLoading, callRecordings, upcomingCalls } =
    useGetCalls();
  const router = useRouter();
  const { toast } = useToast();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "recording":
        return recordings;
      case "upcoming":
        return upcomingCalls;
      default:
        return [];
    }
  };
  const getNoCalls = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "recording":
        return "No Call Recordings";
      case "upcoming":
        return "No Upcoming Calls";
      default:
        return "";
    }
  };
  const calls = getCalls();
  const noCalls = getNoCalls();

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meet) => meet.queryRecordings()) ?? []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({ title: "Try again later!" });
      }
    };
    type === "recording" && fetchRecordings();
  }, [callRecordings]);
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {isLoading && (
        <Image
          src="/icons/loading-circle.svg"
          alt="loading..."
          width={50}
          height={50}
        />
      )}
      {!isLoading && calls && calls.length > 0
        ? calls.map((meeting: Call | CallRecording) => (
            <MeetingCard
              key={(meeting as Call).id}
              title={
                (meeting as Call)?.state?.custom?.description?.substring(
                  0,
                  26
                ) ||
                meeting?.filename?.substring(0, 20) ||
                "No Title"
              }
              date={
                (meeting as Call)?.state?.startsAt?.toLocaleString() ||
                (meeting as CallRecording)?.start_time.toLocaleString()
              }
              icon={
                type === "ended"
                  ? "/icons/previous.svg"
                  : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
              }
              isPreviousMeeting={type === "ended"}
              buttonIcon1={type === "recording" ? "/icons/play.svg" : undefined}
              buttonText={type === "recording" ? "Play" : "Start"}
              handleClick={
                type === "recording"
                  ? () => {
                      router.push(`${(meeting as CallRecording).url}`);
                    }
                  : () => {
                      router.push(`/meeting/${(meeting as Call).id}`);
                    }
              }
              link={
                type === "recording"
                  ? (meeting as CallRecording).url
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                      (meeting as Call).id
                    }`
              }
            />
          ))
        : !isLoading && <h1 className="">{noCalls}</h1>}
    </div>
  );
};

export default CallList;
