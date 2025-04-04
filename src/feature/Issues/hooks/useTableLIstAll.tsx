import { useState } from "react";
import { useBulkIssues } from "./useBulkIssues";
import { useRoomContext } from "../../../hooks/useRoomContext";
import { useIssuesContext } from "../../../hooks/useIssuesContext";
import { Issue } from "../types/issues";
import { Button, TableColumnsType, Image, message as messageApi } from "antd";
import { EventAction } from "../../Room/types/events";

export const useTableLIstAll = () => {
  const statusColors: Record<string, { bg: string; text: string }> = {
    "In Progress": { bg: "bg-blue-100", text: "text-blue-500" },
    Done: { bg: "bg-green-100", text: "text-green-500" },
    "To Do": { bg: "bg-gray-100", text: "text-gray-500" },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewMode, setViewMode] = useState("Preview Issues");
  const { issues, setIssues, updatedIssues, setUpdatedIssues } =
    useIssuesContext();
  const { socket } = useRoomContext();
  const BulkIssue = useBulkIssues();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    if (selectedRowKeys.length > 0) {
      const ids = selectedRowKeys.map((key) => Number(key));

      // แสดงข้อความว่าเริ่มทำการอัปเดต
      const loadingMessage = messageApi.loading("Update in Progress...", 0);

      BulkIssue.mutate(
        { ids },
        {
          onSuccess: () => {
            // console.log("Update issue success:", data);
            // ✅ อัปเดตรายการ issue ที่ถูกอัปเดตแล้ว
            setUpdatedIssues((prev) => new Set([...prev, ...ids]));

            // ✅ เคลียร์การเลือกหลังอัปเดต
            setSelectedRowKeys([]);

            // ✅ อัปเดต `issues` โดยเพิ่ม `updatedAt` แค่ Issue ที่เป็น Jira เท่านั้น
            setIssues((prevIssues) =>
              prevIssues.map((issue) =>
                ids.includes(issue.id)
                  ? { ...issue, jiraLinkedAt: new Date().toLocaleString() } // อัปเดตเฉพาะ Jira
                  : issue
              )
            );

            // แสดงข้อความว่าอัปเดตเสร็จสิ้น
            loadingMessage();
            messageApi.success("Update finished");
          },
          onError: (error) => {
            console.error("Update issue error:", error);

            // แสดงข้อความว่ามีข้อผิดพลาดเกิดขึ้น
            loadingMessage();
            messageApi.error("Failed to update issues.");
          },
        }
      );
    } else {
      alert("Please select at least one issue to update.");
    }
  };

  const handleUpdateAll = () => {
    // เลือกเฉพาะ Issue ที่มาจาก Jira และยังไม่ถูกอัปเดต
    const ids = issues
      .filter((issue) => issue.jiraRawData && !issue.updatedAt)
      .map((issue) => issue.id);

    if (ids.length > 0) {
      // แสดงข้อความว่าเริ่มทำการอัปเดตทั้งหมด
      const loadingMessage = messageApi.loading("Update all in Progress...", 0);

      BulkIssue.mutate(
        { ids },
        {
          onSuccess: () => {
            console.log("Update all issues success");

            // ✅ อัปเดต `updatedIssues`
            setUpdatedIssues((prev) => new Set([...prev, ...ids]));

            // ✅ อัปเดต `issues` โดยเพิ่ม `updatedAt` แค่ Issue ที่เป็น Jira เท่านั้น
            setIssues((prevIssues) =>
              prevIssues.map((issue) =>
                ids.includes(issue.id)
                  ? { ...issue, jiraLinkedAt: new Date().toLocaleString() } // อัปเดตเฉพาะ Jira
                  : issue
              )
            );
            // แสดงข้อความว่าอัปเดตเสร็จสิ้น
            loadingMessage();
            messageApi.success("Update finished");
          },
          onError: (error) => {
            console.error("Update all issues error:", error);

            // แสดงข้อความว่ามีข้อผิดพลาดเกิดขึ้น
            loadingMessage();
            messageApi.error("Failed to update all issues.");
          },
        }
      );
    } else {
      alert("All Jira issues are already updated.");
    }
  };

  const handleRemove = () => {
    if (selectedRowKeys.length > 0) {
      // ส่ง selectedRowKeys ที่เป็น array ของ id ไป
      const ids = selectedRowKeys.map((key) => Number(key)); // convert to numbers

      setIssues((prev) => prev.filter((issue) => !ids.includes(issue.id))); // ลบรายการจาก issues

      setSelectedRowKeys([]); // ล้างค่าหลังจากลบ

      socket?.emit("broadcast", {
        type: "BulkDelete",
        data: { id: ids },
      });

      socket?.emit("issue", {
        type: EventAction.BulkDelete,
        data: { id: ids },
      });

      messageApi.success("Deleted finished");
    }
  };

  // ฟังก์ชันจัดการการเลือกแถว
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "5%",
    onSelect: (record: Issue, selected: boolean) => {
      if (selected) {
        setSelectedRowKeys([...selectedRowKeys, record.id]);
      } else {
        setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
      }
    },
    onSelectAll: (selected: boolean, selectedRows: Issue[]) => {
      if (selected) {
        setSelectedRowKeys(selectedRows.map((row) => row.id));
      } else {
        setSelectedRowKeys([]);
      }
    },
  };

  const getColumns = <T extends Issue>(): TableColumnsType<T> => [
    {
      width: "5%",
      title: "TYPE",
      dataIndex: ["jiraRawData", "issue", "issuetype", "iconUrl"],
      align: "center",
      render: (icon) => (icon ? <Image src={icon} alt="icon" /> : "---"),
    },
    {
      title: "KEY",
      dataIndex: "jiraIssueKey",
      width: "10%",
      align: "center",
      render: (text) => text || "---",
    },
    {
      title: "Name",
      dataIndex: "title",
      width: "30%",
      render: (text) => text || "---",
    },
    {
      title: "STATUS",
      dataIndex: ["jiraRawData", "issue", "status", "name"],
      align: "center",
      width: "20%",
      render: (status) => {
        const { bg, text } = statusColors[status] || {
          bg: "bg-gray-100",
          text: "text-gray-500",
        };
        return (
          <span
            className={`inline-block px-6 py-3 rounded-xl font-semibold ${bg} ${text}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "LAST UPDATE",
      width: "20%",
      align: "center",
      dataIndex: "jiraLinkedAt",
      render: (jiraLinkedAt: string) =>
        jiraLinkedAt ? new Date(jiraLinkedAt).toLocaleString() : "--",
    },
  ];

  const columns = getColumns<Issue>();

  if (viewMode === "Update Issues") {
    columns.push({
      title: "UPDATE",
      width: "10%",
      align: "center",
      render: (_, record) => {
        // ✅ ถ้า Issue ถูกอัปเดตแล้ว ให้ซ่อนปุ่ม Update
        if (updatedIssues.has(record.id)) {
          return null;
        }
        // ตรวจสอบว่า Issue เป็น Jira โดยดูที่ jiraRawData
        if (record.jiraRawData) {
          return (
            <Button
              onClick={handleUpdate}
              className="bg-transparent text-[#A073CC] border-[#A073CC]"
            >
              <Image
                src="/buttonupdate.svg"
                width={18}
                height={18}
                preview={false}
              />
            </Button>
          );
        }
        return null; // ไม่แสดงปุ่มถ้าไม่ใช่ Jira
      },
    });
  }

  return {
    BulkIssue,
    showModal,
    handleOk,
    handleCancel,
    handleUpdate,
    handleUpdateAll,
    handleRemove,
    onSelectChange,
    rowSelection,
    getColumns,
    columns,
    viewMode,
    setViewMode,
    isModalOpen,
    setIsModalOpen,
    selectedRowKeys,
    setSelectedRowKeys,
    issues,
  };
};
