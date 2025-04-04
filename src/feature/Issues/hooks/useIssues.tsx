import { Issue, CreateIssue, IssueStatus } from "../types/issues";
import { EventAction } from "../../Room/types/events";
import { useRoomContext } from "../../../hooks/useRoomContext";
import { useIssuesContext } from "../../../hooks/useIssuesContext";
import { Form } from "antd";
import { useUserContext } from "../../../hooks/useUserContext";
import { useVoteContext } from "../../../hooks/useVoteContext";

export const useIssues = () => {
  const { socket, setIsModalOpen } = useRoomContext();
  const { issues, setIssues, currentActionIssue, setCurrentActionIssue } =
    useIssuesContext();
  const [form] = Form.useForm();
  const { setAllUsers, allParticipants } = useUserContext();
  const { setIsCardRevealed, setSelectedCard } = useVoteContext();

  // เพิ่มหรืออัปเดต issue
  const handleAddOrUpdateIssue = (values: CreateIssue) => {
    const newIssue: CreateIssue = {
      ...values,
      status:
        currentActionIssue !== null
          ? currentActionIssue.status
          : IssueStatus.Pending,
    };

    if (currentActionIssue !== null) {
      console.log("currentIssue", currentActionIssue);
      socket?.emit("issue", {
        data: {
          id: currentActionIssue.id,
          ...newIssue,
        },
        type: EventAction.Update,
      });
    } else {
      const issueToAdd = { ...newIssue, id: issues.length };
      socket?.emit("issue", {
        data: issueToAdd,
        type: EventAction.Create,
      });
    }

    setIsModalOpen(false);
    setCurrentActionIssue(null);
    form.resetFields();
  };

  // เริ่มหรือยกเลิกการโหวต
  const handleStartVoting = (thisIssue: Issue) => {
    const isVoting = thisIssue.status === IssueStatus.Voting;
    const currentVoting = issues.find(
      (issue) => issue.status === IssueStatus.Voting
    );

    // ถ้ามีการโหวตอยู่แล้วและเลือก issue อื่น
    if (thisIssue.id !== currentVoting?.id && currentVoting) {
      socket?.emit("issue", {
        data: {
          id: currentVoting?.id,
          status: IssueStatus.Pending, // เปลี่ยนเป็น Pending
          storyPoints: null, // รีเซ็ต storyPoints
        },
        type: EventAction.Update,
      });
    }

    const isCompleted = thisIssue.status === IssueStatus.Completed;

    // ถ้า issue เป็น Completed หรือ กำลังโหวตให้รีเซ็ตกลับไปที่ Pending
    const updatedIssue = {
      id: thisIssue.id,
      status:
        isCompleted || isVoting
          ? IssueStatus.Pending // เปลี่ยนสถานะกลับไปเป็น Pending
          : IssueStatus.Voting,
      storyPoints: isCompleted ? null : thisIssue.storyPoints, // รีเซ็ต storyPoints หากเป็น Completed
    };

    socket?.emit("issue", {
      data: updatedIssue,
      type: EventAction.Update,
    });

    // แจ้งให้ทุก client ทราบว่ามีการ Revote
    socket.emit("broadcast", {
      type: "revote",
      data: { message: "Revote started!" },
    });

    // รีเซ็ตค่าที่เกี่ยวข้องกับการโหวต
    setAllUsers((prev) =>
      prev.map((user) => ({ ...user, selectedCard: null, isVoting: false }))
    );

    setIsCardRevealed(false); // ✅ ซ่อนผลโหวต
    setSelectedCard(null);
  };

  // ลบ issue
  const handleDeleteTask = (id: number) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));

    socket?.emit("issue", {
      data: {
        id,
      },
      type: EventAction.Delete,
    });

    // });
  };

  const handleRevote = (issue: Issue) => {
    const isCompleted = issue.status === IssueStatus.Completed;

    // หา issue ปัจจุบันที่กำลัง Voting อยู่
    const currentVoting = issues.find(
      (issue) => issue.status === IssueStatus.Voting
    );

    // หา issue ล่าสุดที่เป็น Completed และมี storyPoints (หมายถึงเคยถูกโหวตมาแล้ว)
    const lastCompleted = [...issues]
      .reverse()
      .find(
        (i) => i.status === IssueStatus.Completed && i.storyPoints !== null
      );

    // ถ้ามี issue ที่กำลัง Voting และกด revote บน issue อื่นที่เป็น Completed
    if (issue.id !== currentVoting?.id && isCompleted) {
      // เปลี่ยน issue ปัจจุบันที่กำลังโหวตกลับเป็น Completed (ถ้ามี)
      if (currentVoting) {
        socket?.emit("issue", {
          data: {
            id: currentVoting.id,
            status: IssueStatus.Completed,
            storyPoints: currentVoting.storyPoints, // คืนค่า storyPoints เดิม
          },
          type: EventAction.Update,
        });
      }

      // ถ้ามี issue ก่อนหน้าที่เคย Completed และมี storyPoints ให้คืนค่าเป็น Completed
      if (lastCompleted && lastCompleted.id !== issue.id) {
        socket?.emit("issue", {
          data: {
            id: lastCompleted.id,
            status: IssueStatus.Completed,
            storyPoints: lastCompleted.storyPoints,
          },
          type: EventAction.Update,
        });
      }
    }

    // เปลี่ยน issue ที่กด revote เป็น Voting และรีเซ็ต storyPoints
    socket?.emit("issue", {
      data: {
        id: issue.id,
        status: IssueStatus.Voting,
      },
      type: EventAction.Update,
    });
    // ส่ง event ไปที่ server เพื่ออัปเดตสถานะของ issue
    socket.emit("issue", {
      type: EventAction.Update,
      data: {
        ...issue,
        status: IssueStatus.Voting, // ✅ กลับไปเป็น Voting
      },
    });

    // แจ้งให้ทุก client ทราบว่ามีการ Revote
    socket.emit("broadcast", {
      type: "revote",
      data: { message: "Revote started!" },
    });

    // รีเซ็ตค่าที่เกี่ยวข้องกับการโหวตใน allParticipants
    allParticipants.forEach((user) => {
      user.isVoting = false;
      user.selectedCard = null;
    });

    // รีเซ็ตค่าผู้ใช้ใน state ด้วยการตั้งค่าใหม่
    setAllUsers((prev) =>
      prev.map((user) => ({ ...user, selectedCard: null, isVoting: false }))
    );

    // รีเซ็ตค่าของตัวเอง (me)
    setSelectedCard(null);
    setIsCardRevealed(false); // ✅ ซ่อนผลโหวต
  };

  // แก้ไข issue
  const handleEditTask = (issue: Issue) => {
    setCurrentActionIssue(issue);
    form.setFieldsValue(issue);
    setIsModalOpen(true);
  };

  // ดูรายละเอียด issue
  const handleViewTask = (issue: Issue) => {
    setCurrentActionIssue(issue);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentActionIssue(null);
    form.resetFields();
  };

  return {
    form,
    handleAddOrUpdateIssue,
    handleDeleteTask,
    handleStartVoting,
    handleEditTask,
    handleViewTask,
    handleCancel,
    handleRevote,
  };
};
