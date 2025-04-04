import { EyeOutlined } from "@ant-design/icons";
import { Tabs, Typography } from "antd";
import { useUserContext } from "../../../hooks/useUserContext";
import "../styles/tabs.css";
import { AiOutlineUser } from "react-icons/ai";
import { useState } from "react";

export const TabsUser = () => {
  const { inspectors, allParticipants, currentParicipant } = useUserContext();
  const [activeKey, setActiveKey] = useState("1");

  return (
    <Tabs
      type="card"
      className="w-full bg-white rounded-lg shadow-md"
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
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 overflow-hidden rounded-3xl">
                        <img
                          src={participant.avatarUrl ?? "/profile.jpg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-20">
                        <Typography.Text ellipsis>
                          {participant.displayName}
                        </Typography.Text>
                      </div>
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
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 overflow-hidden rounded-3xl">
                        <img
                          src={participant.avatarUrl ?? "/profile.jpg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-20">
                        <Typography.Text ellipsis>
                          {participant.displayName}
                        </Typography.Text>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
      ]}
    />
  );
};
