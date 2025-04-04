import { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GiPokerHand } from "react-icons/gi";
import { Modal, Button } from "antd";
import { SignInWithJira } from "./SignInWithJira";
import "../../Login/style/index.css";

export default function LoginForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <div className="flex pr-2">
      <Button
        className="flex text-lg px-2 py-4  bg-[#ffffff] rounded-md text-[#5B3F8C] items-center"
        onClick={toggleModal}
      >
        <div className="flex items-center">
          <div className="p-2">
            <AiOutlineUser />
          </div>
          <div className="px-2 font-bai text-sm max-sm:hidden max-md:hidden">
            Sign In
          </div>
        </div>
      </Button>

      <Modal
        visible={isModalOpen}
        onCancel={toggleModal}
        footer={null}
        centered
        width={1000}
      >
        <div className="flex items-center justify-center p-8 max-sm:gap-10 max-sm:flex-col lg:gap-10 lg:pt-12 max-lg:pt-16">
          {/* รูปภาพด้านซ้าย */}
          <div className=" flex-shrink-0 pl-10 max-sm:pl-0">
            <img
              src="/poker.jpg"
              alt="planning poker"
              className="w-[450px] h-auto object-cover rounded-md "
            />
          </div>
          {/* เนื้อหาหลัก */}
          <div className="flex-1 flex flex-col justify-center items-center gap-8 max-sm:gap-2 pl-30">
            <div className="flex items-center gap-4 text-[#5A378C]">
              <GiPokerHand className="text-5xl" />
              <h1 className="text-xl font-bold">Swift Poker</h1>
            </div>
            <SignInWithJira />
          </div>
        </div>
      </Modal>
    </div>
  );
}
