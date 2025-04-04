import React, { useState } from "react";
import { Button, Flex, Image, Modal, Table, Select } from "antd";
import type { TableColumnsType } from "antd";
import { AiOutlineImport } from "react-icons/ai";
import Dropdownfilter from "../dropdown/Dropdownfilter";
import { useGetProjectJira } from "../../hooks/useGetProjectJira";
import { useIssuesContext } from "../../../../hooks/useIssuesContext";
import { IssuesData } from "../../../Room/types/issues.interface";
import "../../styles/index.css";
import { EmptyTable } from "./emptyTable";
import { useGetFieldConfig } from "../../hooks/useGetFieldConfigJira";
import { Issue, IssueStatus } from "../../types/issues";
import { useRoomContext } from "../../../../hooks/useRoomContext";
import { EventAction, EventNamespace } from "../../../Room/types/events";
import { convertJiraDescriptionToHTML } from "./convertJiraDescription";

const statusColors: Record<string, { bg: string; text: string }> = {
  "In Progress": { bg: "bg-blue-100", text: "text-blue-500" },
  Done: { bg: "bg-green-100", text: "text-green-500" },
  "To Do": { bg: "bg-gray-100", text: "text-gray-500" },
};

const columns: TableColumnsType<IssuesData> = [
  {
    width: "10%",
    title: "TYPE",
    dataIndex: ["fields", "issuetype", "iconUrl"],
    align: "center",
    render: (icon) => <Image src={icon} />,
  },
  { title: "KEY", dataIndex: "key", width: "20%" },
  { title: "Name", dataIndex: ["fields", "summary"], width: "50%" },
  {
    title: "STATUS",
    dataIndex: ["fields", "status", "name"],
    align: "center",
    width: "20%",
    render: (status) => {
      const { bg, text } = statusColors[status] || {
        bg: "bg-gray-100",
        text: "text-gray-500",
      };
      return (
        <span
          className={`inline-block px-5 py-3 rounded-xl font-semibold ${bg} ${text}`}
        >
          {status}
        </span>
      );
    },
  },
];

export const AddissuesJira = () => {
  const {
    setProjects,
    setFieldConfig,
    setPagination,
    issueData,
    isFetchingIssue,
    fieldConfig,
  } = useIssuesContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useRoomContext();
  const [isSelectFieldModalOpen, setIsSelectFieldModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null); // 🔹 State สำหรับเก็บค่าฟิลด์ที่เลือก

  const getFieldConfig = useGetFieldConfig();
  const getProject = useGetProjectJira();

  const showModal = () => {
    setIsModalOpen(true);
    getProject.mutate(undefined, {
      onSuccess: (data) => {
        setProjects(data.values);
      },
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsSelectFieldModalOpen(true);
    getFieldConfig.mutate(undefined, {
      onSuccess: (data) => {
        setFieldConfig(data);
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSelectFieldCancel = () => {
    setIsSelectFieldModalOpen(false);
    setIsModalOpen(true);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSelectFieldConfirm = () => {
    if (!selectedField) {
      alert("Please select a field!"); // 🔹 แจ้งเตือนหากยังไม่ได้เลือกฟิลด์
      return;
    }

    setIsSelectFieldModalOpen(false);
    setIsModalOpen(false);

    // 🔹 ค้นหา issues ที่ถูกเลือก
    const selectedIssues = issueData?.issues.filter((issue) =>
      selectedRowKeys.includes(issue.key)
    );

    if (selectedIssues) {
      const newIssues: Issue[] = selectedIssues.map((issue) => {
        const descriptionContent = issue.fields.description?.content;
        const descriptionHTML = descriptionContent
          ? convertJiraDescriptionToHTML(issue.fields.description)
          : "";

        return {
          id: Number(issue.id),
          title: issue.fields.summary,
          description: descriptionHTML,
          status: IssueStatus.Pending,
          type: issue.fields.issuetype.name,
          createdAt: new Date(),
          updatedAt: new Date(),
          jiraIssueKey: issue.key,
          jiraIssueId: issue.id,
          jiraTargetCustomFieldId: selectedField.toString(), // 🔹 ใช้ค่าที่เลือกจาก Modal
          jiraRawData: { issue: issue.fields }, // 🔹 ค่าที่เลือกจาก Modal
        };
      });

      socket.emit(EventNamespace.Issue, {
        type: EventAction.BulkCreate,
        data: { issues: newIssues },
      });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        className="text-[#A073CC] border-[#A073CC] bg-white w-[165px] h-[35px]  max-sm:w-[150px] max-sm:h-[40px] max-lg:w-[165px] max-lg:h-[44px] max-sm:rounded-lg max-lg:rounded-lg"
      >
        <div>
          <AiOutlineImport />
        </div>
        <div className="text-sm text-[#A073CC] max-sm:text-xs ">
          Import from JIRA
        </div>
      </Button>
      <Modal
        width={1200}
        title="Import Jira Issues"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Dropdownfilter />
        <Flex gap="middle" vertical>
          {/* ห่อ Table ด้วย div ที่มี overflow-x: auto */}
          <div className="overflow-x-auto w-full">
            <Table
              scroll={{ x: "max-content" }}
              className="mt-5 min-w-full"
              locale={{ emptyText: <EmptyTable /> }}
              loading={isFetchingIssue}
              rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
                columnWidth: "5%",
              }}
              columns={columns}
              dataSource={issueData?.issues}
              pagination={{
                pageSize: 10,
                onChange: (page, pageSize) => {
                  setPagination({ current: page, pageSize });
                },
                showSizeChanger: true,
                total: 100,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </div>
        </Flex>
        <div className="flex justify-end gap-5">
          <Button
            onClick={handleCancel}
            className="border-[#5A378C] text-[#5A378C] max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleOk}
            className="bg-[#5A378C] text-white max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
            disabled={selectedRowKeys.length === 0}
          >
            Import
          </Button>
        </div>
      </Modal>

      {/* Modal ใหม่: Select Field */}
      <Modal
        width={500}
        open={isSelectFieldModalOpen}
        onCancel={handleSelectFieldCancel}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-3 py-4">
          <h2 className="text-center font-semibold">Select Field</h2>
          <p className="text-gray-500 text-center">
            Please select a field where the result will be input.
          </p>

          <Select
            className="w-full"
            placeholder="Please select a field"
            onChange={(value) => setSelectedField(value)}
          >
            {fieldConfig.map((field, index) => (
              <Select.Option key={index} value={field.id}>
                {field.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="flex justify-center gap-5 mt-5">
          <Button
            onClick={handleSelectFieldCancel}
            className="border-[#5A378C] text-[#5A378C] w-3/6 max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
          >
            Cancel
          </Button>
          <Button
            className="bg-[#5A378C] text-white w-3/6 max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
            onClick={handleSelectFieldConfirm}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
};
