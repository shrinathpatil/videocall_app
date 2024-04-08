"use client";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type Props = {
  setIsSetupComplete: (value: boolean) => void;
};

const MeetingSetup = ({ setIsSetupComplete }: Props) => {
  const [isMicCamToogledOn, setIsMicCamToogledOn] = useState<boolean>(false);

  const call = useCall();

  useEffect(() => {
    if (isMicCamToogledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToogledOn, call?.camera, call?.microphone]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label
          htmlFor="box"
          className="flex items-center justify-center gap-2 font-medium"
        >
          <input
            id="box"
            type="checkbox"
            checked={isMicCamToogledOn}
            onChange={(e) => setIsMicCamToogledOn(e.target.checked)}
            className=""
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md text-white bg-green-500 px-4 py-2.5"
        onClick={() => {
          call?.join();
          setIsSetupComplete(true);
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
