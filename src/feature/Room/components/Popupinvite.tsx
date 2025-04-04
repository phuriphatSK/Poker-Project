import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ConfigProvider,
  Flex,
  Input,
  message,
  Popover,
  QRCode,
  Space,
} from "antd";
import { AiOutlineCopy, AiOutlineUserAdd } from "react-icons/ai";
import { BiSolidDownload } from "react-icons/bi";
import { useRoomContext } from "../../../hooks/useRoomContext";
import "../styles/popupinvite.css";

function doDownload(url: string, fileName: string) {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const App: React.FC = () => {
  const { room } = useRoomContext();
  const qrRef = useRef<HTMLDivElement>(null);

  const [placement, setPlacement] = useState<"bottom" | "bottomRight">(
    "bottomRight"
  );

  useEffect(() => {
    const updatePlacement = () => {
      setPlacement(window.innerWidth <= 640 ? "bottom" : "bottomRight");
    };

    updatePlacement(); // ตั้งค่าครั้งแรก
    window.addEventListener("resize", updatePlacement); // อัพเดทเมื่อขนาดจอเปลี่ยน

    return () => window.removeEventListener("resize", updatePlacement);
  }, []);

  // สร้าง URL `/joinqr/room/$roomId`
  const joinQRUrl = `${window.location.origin}/joinqr/${room?.code}`;

  // ฟังก์ชันดาวน์โหลด QR Code
  const downloadCanvasQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      doDownload(url, "QRCode.png");
    } else {
      message.error("QR Code ไม่พร้อมใช้งาน");
    }
  };

  // ฟังก์ชันสำหรับคัดลอก URL ไปที่คลิปบอร์ด
  const copyUrlToClipboard = () => {
    navigator.clipboard
      .writeText(joinQRUrl)
      .then(() => {
        message.success("Copy URL");
      })
      .catch((err) => {
        message.error("Can't Copy URL: " + err);
      });
  };

  const content = (
    <Space>
      <div className="flex flex-col gap-4 relative p-3 max-sm:p-0 max-md:p-0 max-lg:p-0 max-xl:p-0">
        <div className="text-xl text-[#5A378C] font-semibold">
          <h1>Invite Your Team</h1>
        </div>
        <span>Room ID: {room?.code}</span>
        <Input value={joinQRUrl} className="text-black " disabled />
        <div className="flex max-sm:flex-col max-md:flex-col max-lg:flex-col max-sm:gap-2 max-md:gap-2 max-lg:gap-2 max-xl:gap-2 max-xl:flex-col">
          <Button
            className="bg-[#5A378C] text-white rounded-md max-sm:p-5"
            onClick={copyUrlToClipboard}
          >
            <AiOutlineCopy />
            COPY URL
          </Button>
          <Button
            className="text-[#A073CC] border-[#A073CC] max-sm:p-5"
            onClick={downloadCanvasQRCode}
          >
            <BiSolidDownload />
            DOWNLOAD QR CODE
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden border-[#A073CC]">
        <div
          ref={qrRef}
          className="flex justify-center items-center border-[#A073CC] p-3"
        >
          <QRCode
            value={joinQRUrl}
            bgColor="#fff"
            style={{
              borderColor: "#A073CC",
            }}
          />
        </div>
      </div>
    </Space>
  );

  return (
    <ConfigProvider>
      <Flex justify="center" align="center" style={{ whiteSpace: "nowrap" }}>
        <Popover
          placement={placement}
          content={content}
          trigger="click"
          className="relative"
          arrow={false}
        >
          <Button className="flex bg-white text-[#5A378C] max-sm:text-[#A073CC] max-xl:text-[#A073CC] max-xl:border-[#A073CC] text-base font-semibold lg:p-5 border-[#A073CC] max-lg:border-[#A073CC] xl:border-none 2xl:border-none max-sm:w-[44px] max-sm:h-[44px] max-lg:w-[44px] max-lg:h-[44px] max-xl:w-[44px] max-xl:h-[44px] rounded-lg">
            <div className="text-lg font-semibold ">
              <AiOutlineUserAdd />
            </div>
            <div className="max-sm:hidden max-md:hidden max-lg:hidden max-xl:hidden">
              Invite Other
            </div>
          </Button>
        </Popover>
      </Flex>
    </ConfigProvider>
  );
};

export default App;
