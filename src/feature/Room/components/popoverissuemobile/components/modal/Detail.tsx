import { Button, Image, Modal } from "antd";
import { AiFillEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { Issue } from "../../../../../Issues/types/issues";
import { usePopoverIssuesContext } from "../../../../../../hooks/usePopoverIssuesContext";

interface IssuesListProps {
  issues: Issue[];
  setCurrentIssue: (issue: Issue | null) => void;
  onClose: () => void;
  onDelete: (id: number) => void;
}

export const Detail = ({
  issues,
  setCurrentIssue,
  onClose,
  onDelete,
}: IssuesListProps) => {
  const {
    setIsOpenDetail,
    setIssue,
    isOpenDetail,
    issue,
    setIsOpenEdit,
    setIsConfirmOpen,
    selectedIssueId,
    isConfirmOpen,
  } = usePopoverIssuesContext();

  const handleCloseModalDetail = () => {
    setIsOpenDetail(false);
    setIssue(null);
  };

  const onEdit = () => {
    setCurrentIssue(issue); // กำหนด Issue ที่ต้องการแก้ไข
    setIsOpenEdit(true);
    setIsOpenDetail(false);
  };

  return (
    <>
      {/* Modal Detail */}
      <Modal
        width={600}
        height={600}
        open={isOpenDetail}
        onCancel={handleCloseModalDetail}
        footer={null}
        title={
          <div className="items-center w-full flex justify-end pr-6">
            <div className="flex gap-3">
              <Button
                type="link"
                onClick={() => {
                  onEdit();
                }}
                style={{ padding: 0 }}
              >
                <AiFillEdit className="text-[#A073CC]" size={20} />
              </Button>
              <Button
                type="link"
                danger
                onClick={() => {
                  setIsConfirmOpen(true);
                  handleCloseModalDetail();
                }}
                style={{ padding: 0 }}
              >
                <MdOutlineDelete size={20} />
              </Button>
            </div>
          </div>
        }
      >
        {issue && (
          <div className="flex flex-col gap-3">
            <p className="text-xl font-semibold">
              {(
                issue.jiraRawData?.issue as {
                  issuetype?: { name?: string };
                }
              )?.issuetype?.name
                ? `[${(issue.jiraRawData?.issue as { issuetype?: { name?: string } })?.issuetype?.name}] `
                : ""}
              {issue.title}
            </p>
            <div className="flex gap-40">
              <div className="gap-2 items-center text-sm font-semibold">
                <p className="text-sm font-semibold">Type</p>
                <div className="flex gap-2 items-center text-sm font-semibold">
                  <p className="pt-1 ">
                    {(
                      issue.jiraRawData?.issue as {
                        issuetype?: { iconUrl?: string };
                      }
                    )?.issuetype?.iconUrl && (
                      <Image
                        src={
                          (
                            issue.jiraRawData?.issue as {
                              issuetype?: { iconUrl?: string };
                            }
                          )?.issuetype?.iconUrl
                        }
                        alt="Issue Type Icon"
                        width={16}
                        height={16}
                        preview={false}
                      />
                    )}
                  </p>
                  <p className="text-gray-500 font-medium">
                    {(
                      issue.jiraRawData?.issue as {
                        issuetype?: { name?: string };
                      }
                    )?.issuetype?.name || ""}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Status</p>
                <div className="flex gap-2 items-center text-sm font-semibold">
                  <p className="text-gray-500 font-medium">
                    {(
                      issue.jiraRawData?.issue as {
                        status?: { name?: string };
                      }
                    )?.status?.name || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col pt-3">
              <p className=" text-md font-semibold">description</p>
              <div
                dangerouslySetInnerHTML={{ __html: issue.description ?? "" }}
              />
            </div>
            <div className="flex flex-col gap-44 ">
              <div className="flex flex-col pt-3">
                <p className="text-md font-semibold">Story Points</p>
                <p className="text-md font-semibold">{issue.storyPoints}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleCloseModalDetail}
                  className="text-[#5A378C] border-transparent"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal ยืนยันการลบใน Detail  */}
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
            onClick={() => {
              setIsConfirmOpen(false); // ปิด Modal ยืนยันการลบ
              onClose(); // ปิด Popover หรือหน้าต่างอื่นที่เกี่ยวข้อง

              // หา Issue ที่ต้องการลบโดยใช้ selectedIssueId
              const issueToDelete = issues.find(
                (i) => i.id === selectedIssueId
              );

              if (issueToDelete) {
                onDelete(issueToDelete.id); // เรียกฟังก์ชันลบ Issue
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-10 py-6 rounded-md text-lg"
          >
            Remove
          </Button>
        </div>
      </Modal>
    </>
  );
};
