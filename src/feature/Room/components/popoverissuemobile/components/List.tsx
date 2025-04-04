import { useRoomContext } from "../../../../../hooks/useRoomContext";
import { Issue, IssueStatus } from "../../../../Issues/types/issues";
import { MdPendingActions } from "react-icons/md";
import { Button, Form, Image } from "antd";
import { BiRevision } from "react-icons/bi";
import { IoPlay } from "react-icons/io5";
import { CgMathPlus } from "react-icons/cg";
import { usePopoverIssuesContext } from "../../../../../hooks/usePopoverIssuesContext";

interface IssuesListProps {
  issues: Issue[];
  onStartVoting: (issue: Issue) => void;
  onRevote: (issue: Issue) => void; // ✅ เพิ่ม prop สำหรับ Revote
  setCurrentIssue: (issue: Issue | null) => void;
}

export const List = ({
  issues,
  onStartVoting,
  onRevote,
  setCurrentIssue,
}: IssuesListProps) => {
  const { isHost } = useRoomContext();
  const [form] = Form.useForm();
  const { setSelectedIssueId, setIssue, setIsOpenDetail, setIsOpenEdit } =
    usePopoverIssuesContext();

  const handleSelectIssue = (issue: Issue) => {
    setIssue(issue);
    setSelectedIssueId(issue.id); // เก็บ ID ของ Issue ที่เลือก
    setIsOpenDetail(true);
    form.setFieldsValue(issue);
  };

  const handdleAddIssue = () => {
    setCurrentIssue(null); // เซ็ตค่า currentIssue เป็น null ก่อน
    setIsOpenEdit(true);
    form.resetFields(); // รีเซ็ตฟอร์ม
    setIsOpenDetail(false);
  };

  return (
    <>
      {/* Issue List */}
      {/* <div className="p-2 overflow-y-auto"> */}
      <div className="flex flex-col gap-3 w-full relative lg:flex md:flex max-h-[85%]">
        <div className="flex flex-col gap-2 max-h-[87%] overflow-x-hidden w-full">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => handleSelectIssue(issue)}
              className={` p-4 border rounded-lg shadow-md cursor-pointer bg-white w-full ${
                issue.status === IssueStatus.Voting
                  ? "border-[#A073CC] border-l-4"
                  : ""
              }`} // เพิ่มขอบเมื่ออยู่ในสถานะ Voting
            >
              <div className="flex flex-col gap-2 w-full ">
                <div className="flex justify-between items-center">
                  <p
                    className={`text-gray-500 text-sm px-2 py-1 rounded-md ${
                      issue.status === IssueStatus.Pending
                        ? "bg-[#F6F6F8] text-[#787879]"
                        : issue.status === IssueStatus.Voting
                          ? "bg-[#FFFCF0] text-[#FFA200]"
                          : "bg-[#F3FAF4] text-[#32C040]" // ตรงนี้เป็น Completed โดยอัตโนมัติ
                    }`}
                  >
                    {issue.status === IssueStatus.Pending ? (
                      <div className="flex items-center ">
                        <MdPendingActions
                          style={{
                            width: "16px",
                            height: "16px",
                            marginRight: "8px",
                          }}
                        />
                        <p className="text-[#787879] font-medium">Pending</p>
                      </div>
                    ) : issue.status === IssueStatus.Voting ? (
                      <div className="flex items-center ">
                        <img
                          src="\inprogress.svg"
                          alt="In Progress"
                          style={{
                            width: "16px",
                            height: "16px",
                            marginRight: "8px",
                          }}
                        />
                        <p className="text-[#FFA200] font-medium">
                          In Progress
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center ">
                        <img
                          src="/completed.svg"
                          alt="Completed"
                          style={{
                            width: "16px",
                            height: "16px",
                            marginRight: "8px",
                          }}
                        />
                        <p className="text-[#32C040] font-medium">Completed</p>
                      </div>
                    )}
                  </p>
                  <div className="flex gap-2 items-center text-sm">
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

                <div className="flex flex-col py-2 items-start">
                  <p className=" font-semibold">
                    {(
                      issue.jiraRawData?.issue as {
                        issuetype?: { name?: string };
                      }
                    )?.issuetype?.name
                      ? `[${(issue.jiraRawData?.issue as { issuetype?: { name?: string } })?.issuetype?.name}] `
                      : ""}
                    {issue.title}
                  </p>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: issue.description ?? "",
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Button
                      className="text-black text-sm bg-transparent border-black "
                      onClick={(e) => e.stopPropagation()} // 🔹 ป้องกันการเรียก onViewTask
                    >
                      {issue.storyPoints}
                    </Button>
                    <div className="flex gap-1 items-center text-sm">
                      {issue?.latestVoteSession?.votes?.length ?? 0}
                      <span> vote</span>
                    </div>
                  </div>

                  {/* ✅ ซ่อนปุ่ม Revote / Start Voting ถ้าไม่ใช่ Host */}
                  {isHost && (
                    <Button
                      className="flex bg-transparent border-[#A073CC] text-[#A073CC] justify-end "
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          issue.status === IssueStatus.Completed ||
                          issue.status === IssueStatus.Voting
                        ) {
                          onRevote(issue); // ✅ เรียกฟังก์ชัน Revote
                        } else {
                          onStartVoting(issue);
                        }
                      }}
                    >
                      {issue.status === IssueStatus.Voting ||
                      issue.status === IssueStatus.Completed ? (
                        <div className="flex items-center  text-sm">
                          <BiRevision className="inline-block mr-2" />
                          Revote
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <IoPlay />
                          Start Voting
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ ซ่อนปุ่ม Add Issues ถ้าไม่ใช่ Host */}
        <div className="flex justify-center w-full py-2 ">
          {isHost && (
            <Button
              onClick={handdleAddIssue}
              className="w-full text-[#A073CC] bg-white border-[#A073CC] shadow-md"
            >
              <CgMathPlus />
              Add Issues
            </Button>
          )}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};
