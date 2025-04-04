import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MdOutlineDelete } from "react-icons/md";
import { CreateIssue, Issue } from "../../../../../Issues/types/issues";
import { useEffect } from "react";
import { usePopoverIssuesContext } from "../../../../../../hooks/usePopoverIssuesContext";

interface IssuesListProps {
  setCurrentIssue: (issue: Issue | null) => void;
  onCancel: () => void;
  onSubmit: (values: CreateIssue) => void;
  currentIssue: Issue | null;
  onClose: () => void;
  onCloseEdit: () => void;
  onDelete: (id: number) => void;
}

export const AddEdit = ({
  onCloseEdit,
  onCancel,
  onSubmit,
  currentIssue,
  setCurrentIssue,
  onClose,
  onDelete,
}: IssuesListProps) => {
  const {
    setIsOpenEdit,
    setIsConfirmOpen,
    setIssue,
    isConfirmOpen,
    isOpenEdit,
  } = usePopoverIssuesContext();
  const [form] = Form.useForm();
  const isJiraIssue = !!currentIssue?.jiraRawData; // เช็คว่ามี jiraRawData หรือไม่

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

  const handleCloseModalEdit = () => {
    setIsOpenEdit(false);
    setIssue(null);
    setCurrentIssue(null); // รีเซ็ต currentIssue
    form.resetFields(); // รีเซ็ตฟอร์ม
    onCancel(); // ปิด Modal
  };

  const handleSubmit = (values: CreateIssue) => {
    onSubmit(values); // ส่งค่าไปบันทึก
    setIsOpenEdit(false); // ปิด Modal
    form.resetFields(); // รีเซ็ตฟอร์ม
  };

  const handleDeleteIssue = () => {
    if (currentIssue?.id !== undefined) {
      onDelete(currentIssue.id);
      setIsConfirmOpen(false);
      onCloseEdit();
      setIsOpenEdit(false);
      onCancel();
    }
  };

  const handleCloseDeleteIssueEdit = () => {
    setIsConfirmOpen(false);
    onCloseEdit();
    setIsOpenEdit(false);
    onCancel();
  };
  return (
    <>
      {/* Modal Add Edit */}
      <Modal
        open={isOpenEdit}
        onCancel={handleCloseModalEdit} // ใช้ฟังก์ชันที่แก้ไขแล้ว
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
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="object-cover"
        >
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
              rows={10}
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
                onClick={handleCloseModalEdit}
                className="text-[#5A378C] border-transparent max-sm:w-[165px] max-sm:h-[44px] max-sm:border-[#A073CC]"
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                className="bg-[#5A378C] text-white max-sm:w-[165px] max-sm:h-[44px]"
              >
                {currentIssue ? "Save" : "Add Issue"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal ยืนยันการลบใน edit issue */}
      <Modal
        open={isConfirmOpen}
        onCancel={handleCloseDeleteIssueEdit}
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
};
