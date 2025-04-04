import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";

interface Props {
  viewMode: string;
  setViewMode: (mode: string) => void;
}

export const DropdownListJira: React.FC<Props> = ({
  viewMode,
  setViewMode,
}) => {
  const items: MenuProps["items"] = [
    {
      style: { color: "#A073CC" },
      label: "Preview Issues",
      key: "preview",
      onClick: () => setViewMode("Preview Issues"),
    },
    {
      style: { color: "#A073CC" },
      label: "Update Issues",
      key: "update",
      onClick: () => setViewMode("Update Issues"),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Button className="border-[#A073CC] text-[#A073CC] bg-transparent ">
        <Space>
          {viewMode} {/* แสดงค่าที่เลือก */}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};
