/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Pagination, Spin, Alert, Modal } from "antd";
import { UserOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { RoomParticipantRole } from "../../Room/types/room.interface";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteRecentRoom, useGetRecentRoom } from "../hook/useQueryRecent";
import { AiOutlineMore } from "react-icons/ai";

export const CardRecend = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useGetRecentRoom(currentPage, pageSize);
  const deleteRecentRoom = useDeleteRecentRoom();

  const handleRemoveClick = (room: any) => {
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  const handleRemove = () => {
    if (!selectedRoom) return;

    deleteRecentRoom.mutate(selectedRoom.code, {
      onSuccess: () => {
        console.log(`Delete room success: ${selectedRoom.code}`);

        // 🔥 ลบห้องออกจาก `rooms` ทันที
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room.id !== selectedRoom.code)
        );

        setSelectedRoom(null);
        setIsModalVisible(false);
      },
      onError: (error) => {
        console.error("Delete error:", error);
      },
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  useEffect(() => {
    if (fetchedData?.data) {
      setRooms(fetchedData.data); // อัปเดต rooms เมื่อโหลดข้อมูลเสร็จ
    }
  }, [fetchedData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert message="Error fetching rooms" type="error" showIcon />
      </div>
    );
  }

  const paginatedRooms = rooms;
  const totalItems = fetchedData?.meta?.itemCount || 0;

  return (
    <div className="pt-4">
      {/* Grid Layout */}
      <div className="grid grid-cols-4 gap-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 max-sm:grid-cols-1">
        {paginatedRooms.map((item) => (
          <div
            key={item.id}
            className="relative rounded-lg shadow-xl border bg-white w-full cursor-pointer"
            onClick={() =>
              !isModalVisible &&
              item.id &&
              navigate({
                to: `/room/${item.code}`,
                search: { role: RoomParticipantRole.Participator },
              })
            }
          >
            <div className="w-full h-10 overflow-hidden rounded-t-lg">
              <img
                src="/Card.svg" // ใช้ URL ของไฟล์ที่อัปโหลด
                alt="Room Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              key={item.id}
              className={`relative p-4 pr-5 pl-5 rounded-lg shadow-xl border-none bg-white h-36 w-full flex flex-col justify-center items-start ${
                isModalVisible ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {/* Badge for Room Status */}
              <span
                className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
                  item.deletedAt === null
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {item.deletedAt === null ? "Active" : "Inactive"}
              </span>

              {/* More Button (Now a real Button) */}
              <Button
                className="absolute top-2 right-2 text-xl cursor-pointer bg-transparent border-none"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent clicking the main button
                  handleRemoveClick(item);
                }}
              >
                <AiOutlineMore />
              </Button>

              <div className="flex flex-col items-start pt-4">
                {/* Room Title */}
                <h3 className="text-lg font-semibold mt-6">{item.title}</h3>

                {/* Room Created Date */}
                <p className="text-gray-600 text-sm">
                  <ExclamationCircleOutlined className="mr-1" />{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Participants */}
              <div className="flex justify-between items-center mt-1 w-full">
                <div className="bg-[#F6F6F8] rounded-xl p-2 flex items-center">
                  <span className="text-sm text-[#333333] flex items-center">
                    <UserOutlined className="mr-1" />
                    {item.issueCount} Issue(s)
                  </span>
                </div>
                <span className="text-sm text-[#717171] flex items-center">
                  <UserOutlined className="mr-1" />
                  {item.participantCount} Users
                </span>
              </div>
            </Button>
          </div>
        ))}

        {/* Modal for Confirmation */}
        <Modal
          width={450}
          className="custom-modal"
          open={isModalVisible} // (Antd v4 ใช้ 'visible' / Antd v5 ใช้ 'open')
          onOk={handleRemove}
          onCancel={handleCancel}
          footer={null} // ซ่อน Footer เดิม
          closeIcon={
            <span className="text-gray-500 hover:text-black text-md">✖</span>
          }
        >
          <div className="text-center p-6">
            <h2 className="text-lg font-bold text-gray-900">Are you sure?</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to remove this Room? <br />
              <span className="text-gray-500">
                This action cannot be undone
              </span>
            </p>

            {/* ปุ่ม Footer */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={handleCancel}
                className="border border-purple-500 text-purple-500 w-32 h-10 rounded-md hover:bg-purple-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRemove}
                className="bg-red-500 text-white w-32 h-10 rounded-md hover:bg-red-600"
              >
                Remove
              </Button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalItems}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};
