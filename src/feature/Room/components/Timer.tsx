import React, { useState, useEffect } from "react";
import { Button, Input, Popover } from "antd";
import {
  ClockCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRoomContext } from "../../../hooks/useRoomContext";
import { RevealType } from "../types/room.interface";

const TimerButton: React.FC = () => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [minutes, setMinutes] = useState<number | null>(null); // Input minutes
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Time left in seconds
  const [isActive, setIsActive] = useState(false); // Timer state
  const { socket } = useRoomContext();

  const handleTimeEnd = React.useCallback(() => {
    socket.emit("reveal", { type: RevealType.Timeout, timeout: 0 });
  }, [socket]);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft !== null && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); // Stop timer when it reaches zero
      handleTimeEnd(); // Call the handleTimeEnd function
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [handleTimeEnd, isActive, timeLeft]);

  const handleStartTimer = () => {
    if (minutes && !isNaN(minutes)) {
      setTimeLeft(minutes * 60); // Convert minutes to seconds
      setIsActive(true);
      setIsPopoverVisible(false); // Close the popup
    }
  };

  const handleResetTimer = () => {
    setTimeLeft(null); // Reset timeLeft
    setIsActive(false); // Stop the timer
    setMinutes(null); // Clear input
  };

  const displayTime = () => {
    if (timeLeft === null) return;
    const mins = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const secs = (timeLeft % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const popoverContent = (
    <div className="flex flex-col items-center">
      <Input
        type="number"
        placeholder="Minutes"
        value={minutes !== null ? minutes : ""}
        onChange={(e) => setMinutes(Number(e.target.value))}
        className="mb-2"
      />
      <div className="flex gap-2">
        <Button
          onClick={handleStartTimer}
          icon={<PlayCircleOutlined />}
          className="bg-[#5A378C] text-white max-sm:w-[165px] max-sm:h-[36px]"
        >
          Start
        </Button>
        <Button
          className="text-[#5A378C] border-transparent max-sm:w-[165px] max-sm:h-[36px] max-sm:border-[#A073CC]"
          onClick={handleResetTimer}
          icon={<ReloadOutlined />}
        >
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center">
      <Popover
        content={popoverContent}
        title="Set Timer"
        trigger="click"
        visible={isPopoverVisible}
        onVisibleChange={setIsPopoverVisible}
      >
        <Button
          shape="default"
          icon={<ClockCircleOutlined />}
          className="flex items-center justify-center text-[#A073CC] border-[#A073CC] bg-white hover:bg-[#A073CC] "
        />
      </Popover>
      <span className="ml-4 text-lg font-semibold">{displayTime()}</span>
    </div>
  );
};

export default TimerButton;
