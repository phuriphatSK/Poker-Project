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
  const [minutes, setMinutes] = useState<number | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null); // 🆕
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
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
      setIsActive(false);
      handleTimeEnd();
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [handleTimeEnd, isActive, timeLeft]);

  const handleStartTimer = () => {
    const totalSeconds = (minutes ?? 0) * 60 + (seconds ?? 0); // 🆕 รวมทั้งนาทีและวินาที

    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsActive(true);
      setIsPopoverVisible(false);
    }
  };

  const handleResetTimer = () => {
    setTimeLeft(null);
    setIsActive(false);
    setMinutes(null);
    setSeconds(null); // 🆕
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
      <div className="flex gap-2 mb-2">
        <Input
          className="w-24"
          type="number"
          placeholder="Minutes"
          value={minutes ?? ""}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
        <Input
          className="w-24"
          type="number"
          placeholder="Seconds"
          value={seconds ?? ""}
          onChange={(e) => setSeconds(Number(e.target.value))}
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleStartTimer}
          icon={<PlayCircleOutlined />}
          className="bg-[#5A378C] text-white max-sm:w-[165px] max-sm:h-[36px] w-24"
        >
          Start
        </Button>
        <Button
          className="text-[#5A378C] border-transparent max-sm:w-[165px] max-sm:h-[36px] max-sm:border-[#A073CC] w-24"
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
