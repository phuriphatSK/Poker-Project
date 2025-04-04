import { useState } from "react";
import { Button, Popover, Tabs, Typography } from "antd";
import { useUserContext } from "../../../hooks/useUserContext";
import { AiOutlineUser } from "react-icons/ai";
import { EyeOutlined } from "@ant-design/icons";
import { LuUsers } from "react-icons/lu";
import "../styles/popupuser.css";
import TimerButton from "./Timer";

export const PopoverUser = () => {
  const [open, setOpen] = useState(false);
  const { inspectors, allParticipants, currentParicipant } = useUserContext();
  const [activeKey, setActiveKey] = useState("1");

  const content = (
    <>
      <TimerButton />
      <Tabs
        type="card"
        className="w-full bg-white rounded-lg shadow-md pt-7"
        activeKey={activeKey}
        onChange={setActiveKey} // อัปเดตสถานะเมื่อเปลี่ยนแท็บ
        items={[
          {
            key: "1",
            className: "w-full",
            label: (
              <span
                className={`flex justify-center gap-2 ${
                  activeKey === "1" ? "text-[#E69500]" : "text-[#717171]"
                }`}
              >
                <AiOutlineUser className="size-5" />
              </span>
            ),
            children: (
              <div className="p-4 text-start w-full overflow-auto">
                <h3 className="mb-4 text-[#717171] font-semibold">
                  Online Users
                </h3>
                <ul className="list-disc list-inside text-[#333333]">
                  {allParticipants.map((participant) => (
                    <li
                      key={participant.id}
                      className="flex justify-between items-center "
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 overflow-hidden rounded-3xl">
                          <img
                            src={participant.avatarUrl ?? "/profile.jpg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Typography.Text ellipsis>
                          {participant.displayName}
                        </Typography.Text>
                      </div>

                      <div
                        className={`w-24 h-8 text-center rounded-full content-center ${
                          participant.isVoting
                            ? "text-[#32C040] bg-[#F3FAF4]"
                            : "text-[#A5ADBA] bg-[#F6F6F8]"
                        }`}
                      >
                        {participant.isVoting ? "Voted" : "Waiting"}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
          {
            key: "2",
            className: "w-full",
            label: (
              <span
                className={`flex justify-center gap-2 ${
                  activeKey === "2" ? "text-[#E69500]" : "text-[#717171]"
                }`}
              >
                <EyeOutlined className="size-5" />
              </span>
            ),
            children: (
              <div className="p-4 text-start w-full overflow-auto ">
                <h3 className="mb-4 text-[#717171] font-semibold">
                  Spectator Users
                </h3>
                <ul className="list-disc list-inside text-[#333333]">
                  {currentParicipant.isInspector && (
                    <li className="flex gap-4">
                      {currentParicipant.displayName}
                    </li>
                  )}
                  {inspectors.map((participant) => (
                    <li key={participant.id} className="flex gap-4">
                      <Typography.Text ellipsis>
                        {participant.displayName}
                      </Typography.Text>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          },
        ]}
      />
    </>
  );

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={content}
        placement="bottom"
        trigger="click"
        arrow={false} // เอาลูกศรออก
      >
        <Button className="border-[#A073CC] w-[44px] h-[44px] rounded-lg text-[#A073CC] max-lg:block xl:hidden 2xl:hidden">
          <LuUsers />
        </Button>
      </Popover>
    </>
  );
};
