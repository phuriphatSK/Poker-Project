import { Button, Flex, Image, Input, Modal, Table } from "antd";
import type { TableColumnsType } from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import "../../styles/index.css";
import { PiListLight } from "react-icons/pi";

import { EmptyTable } from "./emptyTable";
import { Issue } from "../../types/issues";
import { useTableLIstAll } from "../../hooks/useTableLIstAll";
import { useEffect, useMemo, useState } from "react";
import { DropdownListJira } from "../dropdown/DropdownTableListAll";
export const IssuesTableListAll = () => {
  const {
    showModal,
    handleOk,
    handleCancel,
    handleUpdate,
    handleUpdateAll,
    handleRemove,
    rowSelection,
    columns,
    viewMode,
    setViewMode,
    isModalOpen,
    selectedRowKeys,
    issues,
  } = useTableLIstAll();

  const [searchTerm, setSearchTerm] = useState(""); // ✅ เก็บค่าค้นหา
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  // ✅ กรอง issues ตามค่าที่พิมพ์ในช่องค้นหา
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [issues, searchTerm]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1280px)");
    setIsSmallScreen(mediaQuery.matches);

    const handleResize = () => setIsSmallScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <>
      <Button
        className="bg-white border-[#A073CC] text-[#A073CC] text-xl  w-[44px] h-[35px]   max-sm:w-[44px] max-sm:h-[40px] max-lg:w-[44px] max-lg:h-[44px] max-sm:rounded-lg max-lg:rounded-lg"
        onClick={showModal}
      >
        <PiListLight />
      </Button>
      <Modal
        width={1200}
        title="Issues"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex justify-between items-center mb-3">
          <span>
            {viewMode === "Preview Issues"
              ? "List of Issues"
              : "Update and Remove Issues"}
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            className="border-[#A073CC]"
            placeholder="Search"
            prefix={<SearchOutlined style={{ color: "#717171" }} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <DropdownListJira viewMode={viewMode} setViewMode={setViewMode} />
            {viewMode === "Update Issues" && (
              <Button
                className="bg-transparent text-[#A073CC] border-[#A073CC]"
                onClick={handleUpdateAll}
              >
                <Image src="/buttonupdate.svg" width={18} height={18} />
                <div className="text-sm text-[#A073CC] max-sm:hidden max-md:hidden">
                  Update All
                </div>
              </Button>
            )}
          </div>
        </div>
        <Flex gap="middle" vertical>
          {/* ใช้ div ครอบ Table เพื่อให้ overflow-x ทำงาน */}
          <div className="overflow-x-auto w-full">
            <Table
              key={filteredIssues.length}
              className="mt-5 min-w-full"
              locale={{ emptyText: <EmptyTable /> }}
              columns={columns as TableColumnsType<Issue>}
              dataSource={
                filteredIssues.map((issue) => ({ ...issue, key: issue.id })) ||
                []
              }
              rowSelection={
                viewMode === "Update Issues" ? rowSelection : undefined
              }
              pagination={{
                showSizeChanger: true,
                total: filteredIssues.length || 0,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                defaultPageSize: 10,
              }}
              footer={() =>
                viewMode === "Update Issues" && selectedRowKeys.length > 0 ? (
                  <div className="flex justify-center items-center bg-white rounded-xl shadow-md relative w-full duration-300 border border-gray-300 py-2 max-sm:w-96 max-md:w-96 max-lg:w-96 max-xl:w-96">
                    <span className="px-3">
                      {selectedRowKeys.length} Selected
                    </span>
                    <div className="border-l border-gray-300 h-6"></div>
                    <Button
                      type="text"
                      icon={<SyncOutlined />}
                      onClick={handleUpdate}
                      className="px-4"
                    >
                      Update
                    </Button>
                    <div className="border-l border-gray-300 h-6"></div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() =>
                        isSmallScreen ? setIsModalVisible(true) : handleRemove()
                      }
                      className="px-4"
                    >
                      Remove
                    </Button>
                  </div>
                ) : null
              }
            />
          </div>
        </Flex>
      </Modal>

      {/* //modal delete */}
      {isSmallScreen && (
        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          centered
          closeIcon={
            <span className="text-purple-500 hover:text-purple-700 text-xl">
              ✕
            </span>
          }
        >
          <div className="flex flex-col text-center pt-10 gap-1">
            <p className="text-xl font-semibold text-gray-900">Are you sure?</p>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove these {selectedRowKeys.length}{" "}
              issues?
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={() => setIsModalVisible(false)}
              className="border border-purple-500 text-purple-500 hover:bg-purple-100 font-medium px-10 py-6 rounded-md text-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsModalVisible(false);
                handleRemove();
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-10 py-6 rounded-md text-lg"
            >
              Remove
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};
