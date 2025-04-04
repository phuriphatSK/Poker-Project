import React, { useState } from "react";
import { Input, Button, Switch, Select } from "antd";
import type { SelectProps } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { useCreateRoom } from "../hooks/useQueryRoom";
import {
  RoomParticipantRole,
  StoryPoint,
  StoryPointType,
} from "../types/room.interface";
import { DefaultOptionType } from "antd/es/select";

const votingOptions: Record<
  StoryPointType,
  { title: string; type: StoryPointType; data: string[] }
> = {
  [StoryPointType.Fibonacci]: {
    title: "Fibonacci",
    type: StoryPointType.Fibonacci,
    data: ["1", "2", "3", "5", "8", "13", "21", "34"],
  },
  [StoryPointType.Linear]: {
    title: "Linear",
    type: StoryPointType.Linear,
    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
  [StoryPointType.Tshirt]: {
    title: "Tshirt",
    type: StoryPointType.Tshirt,
    data: ["XS", "S", "M", "L", "XL", "XXL"],
  },
};

const votingSelectdOption: DefaultOptionType[] = Object.values(
  votingOptions
).map((option) => ({
  value: option.type,
  label: `(${option.title}) (${option.data})`,
}));

const CreateRoom: React.FC = () => {
  const navigate = useNavigate({ from: "/createroom" });
  const JiraCreate = useCreateRoom();
  const [selectedMenu, setSelectedMenu] = useState<StoryPoint | null>(null);
  const [isSpectator, setIsSpectator] = useState(false);
  const [title, setTitle] = useState("");

  const handleMenuClick: SelectProps["onChange"] = (value: StoryPointType) => {
    const selectedOption = votingOptions[value];
    if (selectedOption) {
      setSelectedMenu(selectedOption); // ✅ ต้องกำหนดค่าที่เลือก
    }
  };

  const handleCreateRoom = () => {
    if (!selectedMenu || !title) {
      alert("Please fill in both Display Name and Room ID.");
      return;
    }

    console.log("Room Name:", title);
    console.log("Selected Voting System:", selectedMenu);
    console.log("Spectator Mode:", isSpectator);

    const request = {
      title,
      settings: {
        storyPoint: {
          type: selectedMenu.type,
        },
      },
      role: isSpectator
        ? RoomParticipantRole.Inspector
        : RoomParticipantRole.Participator,
    };

    JiraCreate.mutate(request, {
      onSuccess: (data) => {
        console.log("Create room success:", data);
        const RoomId = data?.code;
        if (RoomId) {
          navigate({
            to: "/room/$roomId",
            params: { roomId: RoomId },
            search: {
              role: isSpectator
                ? RoomParticipantRole.Inspector
                : RoomParticipantRole.Participator,
            },
          });
        } else {
          console.error("Room ID not found in response");
        }
      },
      onError: (error) => {
        console.error("Create error:", error);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[calc(100vh-60px)] gap-4 p-6 bg-[#F5F1FA]">
      <div className="flex flex-col justify-start p-4 lg:p-20 gap-4 max-sm:gap-0">
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-4xl font-semibold text-[#5A378C]">
            Create a Room
          </h1>
          <p className="text-[#333333] mt-4 lg:mt-8 font-bold max-sm:font-medium  max-sm:text-sm">
            Find the room name and select voting system in room details
          </p>
        </div>
        <div className="max-sm:hidden max-md:hidden max-lg:hidden">
          <img src="/create.png" alt="CreateRoom" />
        </div>
      </div>

      <div className="flex flex-col justify-start p-1 lg:p-16 gap-6 max-sm:mb-40 max-md:mb-40 max-lg:mb-40 ">
        <div className="flex flex-col justify-start p-4 lg:p-16 gap-6 bg-white border-[#E0E0E0] rounded-3xl shadow-lg max-md:py-20 max-lg:py-20   ">
          <h1 className="text-lg lg:text-xl font-semibold">Room name</h1>
          <Input
            placeholder="Enter room name ...."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 lg:h-11 border-[#5A378C]"
          />

          <h1 className="text-lg lg:text-xl font-semibold">Voting system</h1>
          <Select
            options={votingSelectdOption}
            onChange={handleMenuClick}
            className="h-10 lg:h-11 flex justify-between items-center border-[#5A378C]"
          ></Select>

          <div className="flex justify-between items-center">
            <p className="font-semibold">Spectator Mode</p>
            <Switch onChange={setIsSpectator} className="bg-white shadow-lg" />
          </div>

          <div className="flex justify-center mt-4">
            <Button
              type="default"
              className="p-6 bg-[#5A378C] text-white font-semibold rounded-xl"
              onClick={handleCreateRoom}
            >
              Create Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
