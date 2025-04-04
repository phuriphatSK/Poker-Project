import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Issue, CreateIssue } from "../../types/issues";
import { useEffect, useState } from "react";
import { MdOutlineDelete } from "react-icons/md";

interface IssueModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateIssue) => void;
  currentIssue: Issue | null;
  setCurrentIssue: (issue: Issue | null) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export default function IssueModal({
  onDelete,
  onClose, // สถานะเปิดปิด Modal
  isOpen,
  onCancel,
  onSubmit,
  currentIssue,
  setCurrentIssue,
}: IssueModalProps) {
  const [form] = Form.useForm();
  const isJiraIssue = !!currentIssue?.jiraRawData; // เช็คว่ามี jiraRawData หรือไม่
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (currentIssue) {
      // กรณีแก้ไข Issue → เติมค่าลงฟอร์ม
      form.setFieldsValue({
        title: `[${
          (
            currentIssue.jiraRawData?.issue as {
              issuetype?: { name?: string };
            }
          )?.issuetype?.name || ""
        }] ${currentIssue.title}`,
        description: currentIssue.description,
        storyPoints: currentIssue.storyPoints,
      });
    } else {
      // กรณีเพิ่ม Issue ใหม่ → รีเซ็ตค่าในฟอร์ม
      form.resetFields();
    }
  }, [currentIssue, form]);

  // ปิด Modal และรีเซ็ต currentIssue
  const handleCancel = () => {
    setCurrentIssue(null); // รีเซ็ต currentIssue
    form.resetFields(); // รีเซ็ตฟอร์ม
    onCancel(); // ปิด Modal
  };

  const handleDeleteIssue = () => {
    if (currentIssue?.id !== undefined) {
      onDelete(currentIssue.id);
      setIsConfirmOpen(false);
      onClose();
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onCancel={handleCancel} // ใช้ฟังก์ชันที่แก้ไขแล้ว
        footer={null}
        title={
          currentIssue ? (
            <div className="w-full flex justify-end pr-6">
              <Button
                type="link"
                danger
                onClick={() => {
                  setIsConfirmOpen(true);
                  onClose();
                }}
                style={{ padding: 0 }}
              >
                <MdOutlineDelete size={20} />
              </Button>
            </div>
          ) : (
            "Add Issue"
          )
        }
      >
        <Form layout="vertical" form={form} onFinish={onSubmit}>
          <Form.Item
            label="Name"
            name="title"
            rules={[{ required: true, message: "Please enter an Issue name" }]}
          >
            <Input placeholder="Enter Issue name ..." disabled={isJiraIssue} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea
              rows={3}
              placeholder="Enter description ..."
              disabled={isJiraIssue}
            />
          </Form.Item>

          {currentIssue && (
            <Form.Item label="Story Points" name="storyPoints">
              <Input placeholder="Enter story points ..." />
            </Form.Item>
          )}
          <Form.Item>
            <div className="flex justify-center gap-2">
              <Button
                onClick={handleCancel}
                className="text-[#5A378C] border-transparent"
              >
                Cancel
              </Button>
              <Button htmlType="submit" className="bg-[#5A378C] text-white">
                {currentIssue ? "Save" : "Add Issue"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal ยืนยันการลบ */}
      <Modal
        open={isConfirmOpen}
        onCancel={() => setIsConfirmOpen(false)}
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
            Are you sure you want to remove this issue?
          </p>
          <p className="text-sm text-gray-600">This action cannot be undone.</p>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => setIsConfirmOpen(false)}
            className="border border-purple-500 text-purple-500 hover:bg-purple-100 font-medium px-10 py-6 rounded-md text-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteIssue}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-10 py-6 rounded-md text-lg"
          >
            Remove
          </Button>
        </div>
      </Modal>
    </>
  );
}
