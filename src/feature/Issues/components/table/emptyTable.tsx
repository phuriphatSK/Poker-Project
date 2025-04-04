import { Image, Typography } from "antd";

export const EmptyTable = () => {
  return (
    <div className="my-20">
      <div className="mb-10">
        <Typography.Title level={3}>No Issues</Typography.Title>
        <Typography.Text>Add filters to find your Jira issues</Typography.Text>
      </div>
      <Image
        // style={{ width: "50%" }}
        width={"40%"}
        className="mx-auto"
        src="/importjiraissues.svg"
        preview={false}
        draggable={false}
      />
    </div>
  );
};
