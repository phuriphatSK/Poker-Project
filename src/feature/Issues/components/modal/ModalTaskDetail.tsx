import { Modal, Button, Image } from "antd";
import { AiFillEdit } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { Issue } from "../../types/issues";
import { useState } from "react";
import "../../styles/index.css";

interface IssueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue | null;
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
}

export default function IssueDetailModal({
  isOpen,
  onClose,
  issue,
  onEdit,
  onDelete,
}: IssueDetailModalProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  if (!issue) return null;

  return (
    <>
      <Modal
        width={600}
        height={600}
        open={isOpen}
        onCancel={onClose}
        footer={null}
        title={
          <div className="items-center w-full flex justify-end pr-6">
            <div className="flex gap-3">
              <Button
                type="link"
                onClick={() => {
                  onEdit(issue);
                  onClose();
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
                  onClose();
                }}
                style={{ padding: 0 }}
              >
                <MdOutlineDelete size={20} />
              </Button>
            </div>
          </div>
        }
      >
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
          <div className="flex gap-48">
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
          <div className="flex flex-col pt-3">
            <p className="text-md font-semibold">Story Points</p>
            <p className="text-md font-semibold">{issue.storyPoints}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={onClose}
              className="text-[#5A378C] border-transparent"
            >
              Close
            </Button>
          </div>
        </div>
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
            onClick={() => {
              onDelete(issue.id);
              setIsConfirmOpen(false);
              onClose();
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-10 py-6 rounded-md text-lg"
          >
            Remove
          </Button>
        </div>
      </Modal>
    </>
  );
}
