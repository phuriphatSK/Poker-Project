import React, { useEffect, useMemo, useState } from "react";
import { FilterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Select,
  SelectProps,
  Tag,
} from "antd";
import { useIssuesContext } from "../../../../hooks/useIssuesContext";
import { useForm } from "antd/es/form/Form";
import { useGetJiraStatus } from "../../hooks/useGetStatusJira";
import { useGetIssuestype } from "../../hooks/useGetIssuesType";
import "../../styles/dropdown/dropdownfilterjira.css";

type TagRender = SelectProps["tagRender"];

const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

const FilterDropdown: React.FC = () => {
  const [form] = useForm();
  const { projects, setFilterIssues, filterIssues } = useIssuesContext();

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filteredStatusOptions, setFilteredStatusOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [filterTypeOptions, setFilterTypeOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640); // เช็กว่าเป็นหน้าจอเล็กหรือไม่
  const [isModalOpen, setIsModalOpen] = useState(false); // สถานะเปิดปิด Modal

  const getIssuesType = useGetIssuestype({ projectId: selectedProject });
  const getStatus = useGetJiraStatus({ projectId: selectedProject });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleReset = () => {
    setFilterIssues({ project: null, status: null, issueType: null });
    form.resetFields();
    setSelectedProject(null);
    setFilteredStatusOptions([]);
    setFilterTypeOptions([]);
  };

  console.log("projects", projects);
  console.log("filterIssues", filterIssues);

  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        label: project.name,
        value: project.id,
      })),
    [projects]
  );

  // ใช้ ProjectId ในการกรอง Type
  useEffect(() => {
    if (selectedProject) {
      if (getIssuesType.data)
        setFilterTypeOptions(
          getIssuesType.data.map((value) => ({
            label: value.name,
            value: value.id,
          }))
        );
    } else {
      setFilterTypeOptions([]);
    }
  }, [getIssuesType.data, selectedProject]);

  // ใช้ ProjectId ในการกรอง Status
  useEffect(() => {
    if (selectedProject) {
      if (getStatus.data?.values)
        setFilteredStatusOptions(
          getStatus.data?.values.map((value) => ({
            label: value.name,
            value: value.id.toString(),
          }))
        );
    } else {
      setFilteredStatusOptions([]);
    }
  }, [getStatus.data?.values, selectedProject]);

  // กำหนดค่าเมื่อมีการเลือก Project
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    form.setFieldsValue({ status: null, type: null }); // รีเซ็ต Status และ Type ที่เลือกเมื่อเปลี่ยน Project
  };

  const filterForm = (
    <Menu className="p-4 w-72 shadow-lg rounded-lg border-none max-sm:border-none max-sm:shadow-none max-sm:w-full max-sm:p-0">
      <Form
        form={form}
        onFinish={(values) => {
          setFilterIssues((prev) => {
            const newFilter = {
              project: values.project,
              status: values.status,
              issueType: values.type,
            };
            return JSON.stringify(prev) !== JSON.stringify(newFilter)
              ? newFilter
              : { ...prev };
          });
          if (isMobile) setIsModalOpen(false); // ปิด Modal หลัง Apply ถ้าเป็นมือถือ
        }}
        layout="vertical"
        className=" max-sm:p-0"
      >
        <div className="text-lg font-semibold mb-2">Filter</div>
        <Form.Item
          name={"project"}
          className="mb-3 max-sm:mt-5 "
          label={"Select Project"}
        >
          <Select
            className="w-full mt-1 border-[#A073CC]"
            value={filterIssues?.project}
            placeholder="Select Project"
            options={projectOptions}
            onChange={handleProjectChange}
          />
        </Form.Item>

        <Form.Item
          name={"type"}
          className="mb-3 max-sm:mt-5"
          label={"Select Type"}
        >
          <Select
            mode="multiple"
            tagRender={tagRender}
            className="w-full mt-1 border-[#A073CC]"
            value={filterIssues?.issueType ?? []}
            placeholder="Select Type"
            options={filterTypeOptions}
            disabled={!selectedProject} // ปิดการใช้งานถ้ายังไม่ได้เลือก Project
          />
        </Form.Item>

        <Form.Item
          name={"status"}
          className="mb-3 max-sm:mt-5"
          label={"Select Status"}
        >
          <Select
            mode="multiple"
            tagRender={tagRender}
            className="w-full mt-1 border-[#A073CC]"
            value={filterIssues?.status ?? []}
            placeholder="Select Status"
            options={filteredStatusOptions}
            disabled={!selectedProject} // ปิดการใช้งานถ้ายังไม่ได้เลือก Project
          />
        </Form.Item>

        <div className="flex justify-between mt-4 max-sm:mt-7 gap-3">
          <Button
            onClick={handleReset}
            className="border-[#A073CC] text-[#A073CC] max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
          >
            Reset
          </Button>
          <Button
            onClick={form.submit}
            className="bg-[#5A378C] text-white max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg"
          >
            Apply
          </Button>
        </div>
      </Form>
    </Menu>
  );

  return (
    <div className="flex gap-3 pt-3 w-full">
      <Input
        className="border-[#A073CC]"
        placeholder="Search"
        prefix={<SearchOutlined style={{ color: "#717171" }} />}
        onChange={(e) =>
          setTimeout(
            () =>
              setFilterIssues({
                ...filterIssues,
                summary: e.target.value.trim(),
              }),
            500
          )
        }
      />
      <Badge dot count={filterIssues.project ? 1 : 0}>
        {isMobile ? (
          <Button
            className="border-[#A073CC] text-[#A073CC] bg-transparent"
            onClick={() => setIsModalOpen(true)}
          >
            <FilterOutlined />
          </Button>
        ) : (
          <Dropdown
            overlay={<Menu className="p-4 w-72">{filterForm}</Menu>}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button className="border-[#A073CC] text-[#A073CC] bg-transparent">
              <FilterOutlined />
            </Button>
          </Dropdown>
        )}
      </Badge>

      {/* Modal สำหรับมือถือ */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {filterForm}
      </Modal>
    </div>
  );
};

export default FilterDropdown;
