// components/addtask.tsx
import React, { useState } from "react";
import { Drawer, Form, Input, Button, Modal, Alert } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { BiImport } from "react-icons/bi";
import TextArea from "antd/es/input/TextArea";
type LayoutType = Parameters<typeof Form>[0]["layout"];

const Addtask: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("vertical");

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={showDrawer}
        className=" bg-transparent text-[#5B3F8C] text-2xl pr-2"
      >
        <UnorderedListOutlined />
      </button>
      <Drawer title="Add Issues" width={400} onClose={onClose} open={open}>
        <div className="flex flex-col justify-start p-5 overflow-y-auto gap-7">
          <div>
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4">Issues</h2>
              <button className="text-xl">
                <BiImport />
                <Alert />
              </button>
            </div>
            <div>
              <p className="text-gray-500">___ issues</p>
            </div>
          </div>
          <div className="flex justify-center ">
            <Button type="default" onClick={showModal} className="w-full">
              Open Modal
            </Button>
            <Modal
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                layout={formLayout}
                form={form}
                initialValues={{ layout: formLayout }}
                onValuesChange={onFormLayoutChange}
                style={{ maxWidth: formLayout === "inline" ? "none" : 600 }}
              >
                <Form.Item label="Name">
                  <Input placeholder="Enter Issues name..." />
                </Form.Item>
                <Form.Item label="Discription">
                  <TextArea rows={3} />
                </Form.Item>
                <Form.Item>
                  <div className="flex justify-center gap-5">
                    <Button type="default" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="primary" onClick={handleOk}>
                      Add
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Addtask;
