import { Link } from "@tanstack/react-router";
import { GiPokerHand } from "react-icons/gi";
import { Modal, Input, Button, Typography } from "antd"; // นำเข้า Modal และ Input จาก antd
import { PopupProfile } from "./PopupProfile";
import Popupinvite from "./Popupinvite";
import { fetchUserInfo } from "../../Login/api";
import { useQuery } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { EventAction } from "../types/events";
import { useRoomContext } from "../../../hooks/useRoomContext";
import { useSocketEvent } from "socket.io-react-hook";
import { Room } from "./../types/room.interface";
import { useUpdateUser } from "../hooks/useQueryRoom";
import { PopoverUser } from "./PopoverUserMobile";
import { PopoverIssue } from "./popoverissuemobile/index";

export const Navbar = () => {
  const { socket, room, setRoom } = useRoomContext();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: fetchUserInfo,
    staleTime: 5000,
  });

  const updateUser = useUpdateUser();

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(
    userData?.displayName || ""
  );

  useEffect(() => {
    setNewDisplayName(userData?.displayName || "");
  }, [userData]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDisplayNameModalOpen(false);
  };

  const handleSaveTitlerRoom = () => {
    setIsModalOpen(false);

    socket.emit("room", {
      data: {
        title: room?.title,
        id: room?.id,
      },
      type: EventAction.Update,
    });
  };

  useSocketEvent(socket, "room", {
    onMessage(data: Room) {
      console.log("onMessage", data);
    },
  });

  const handleSavedisplayName = () => {
    updateUser.mutate(
      { displayName: newDisplayName },
      {
        onSuccess: () => {
          setIsDisplayNameModalOpen(false);

          // ส่ง event ไปให้ทุกคนรู้ว่าชื่อถูกเปลี่ยน
          socket.emit("broadcast", {
            type: "updateDisplayName",
            data: {
              userId: userData?.id,
              newDisplayName,
            },
          });
        },
      }
    );
  };

  return (
    <>
      <header className="flex  items-center justify-between p-1 bg-[#F5F1FA] ">
        {/* Left Section */}
        <div className="flex items-center gap-2 max-sm:gap-0 ">
          <Link to="/">
            <div className="w-10 h-10 flex items-center justify-center text-[#5B3F8C] text-5xl ml-3">
              <GiPokerHand />
            </div>
          </Link>
          <button onClick={() => setIsModalOpen(true)} className="w-12">
            <Typography.Text
              className="text-base font-semibold text-[#5B3F8C]"
              ellipsis
            >
              {room?.title}
            </Typography.Text>
          </button>
        </div>

        {/* Right Section (Large Screens) */}
        <div className="flex items-center gap-1 p-1 md:flex lg:flex ">
          <div className="flex items-center gap-2">
            <button
              className="text-[#5B3F8C] text-base font-semibold sm:hidden lg:block md:block"
              onClick={() => setIsDisplayNameModalOpen(true)}
            >
              <div className="max-sm:hiddle max-md:hidden ">
                {isLoading ? "Loading..." : userData?.displayName || "Guest"}
              </div>
            </button>
            <PopupProfile avatarUrl={userData?.avatarUrl ?? undefined} />
          </div>
          <div className=" max-sm:border-[#A073CC]">
            <Popupinvite />
          </div>
          <div>
            <PopoverUser />
          </div>
          <div>
            {/* <PopoverMobile /> */}
            <PopoverIssue />
          </div>
        </div>
      </header>

      {/* Design displayname */}
      <Modal
        title="Edit User Name"
        open={isDisplayNameModalOpen}
        onOk={handleSavedisplayName}
        onCancel={handleCancel}
        footer={null} // ซ่อน Footer เดิม
        className="flex flex-col gap-4 justify-center"
      >
        <div className="flex flex-col gap-2">
          <span className="pt-4 font-semibold ">User Name</span>
          <Input
            className="border-[#A073CC]"
            placeholder="Enter new room title"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
          {/* ปุ่ม Footer */}
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={handleCancel}
              className="border border-purple-500 text-purple-500 w-32 h-10 rounded-md hover:bg-purple-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavedisplayName}
              className="bg-[#5A378C] text-white w-32 h-10 rounded-md"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal title room*/}
      <Modal
        title="Edit Room Title"
        open={isModalOpen}
        onOk={handleSaveTitlerRoom}
        onCancel={handleCancel}
        footer={null} // ซ่อน Footer เดิม
        className="flex flex-col gap-4 justify-center"
      >
        <div className="flex flex-col gap-2 max-sm:pt-3">
          <span className="font-semibold ">Room name</span>
          <Input
            className="border-[#A073CC]"
            placeholder="Enter new room title"
            value={room?.title}
            onChange={(e) =>
              setRoom((prevRoom) =>
                prevRoom ? { ...prevRoom, title: e.target.value } : null
              )
            }
          />
          {/* ปุ่ม Footer */}
          <div className="flex justify-center gap-4 mt-6 max-sm:mt-3 ">
            <Button
              onClick={handleCancel}
              className="border border-purple-500 text-purple-500 w-32 h-10 rounded-md hover:bg-purple-50 max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTitlerRoom}
              className="bg-[#5A378C] text-white w-32 h-10 rounded-md max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
