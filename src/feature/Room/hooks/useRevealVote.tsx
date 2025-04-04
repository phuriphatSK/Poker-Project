import { useSocketEvent } from "socket.io-react-hook";
import { useIssuesContext } from "../../../hooks/useIssuesContext";
import { useRoomContext } from "../../../hooks/useRoomContext";
import { useUserContext } from "../../../hooks/useUserContext";
import { useVoteContext } from "../../../hooks/useVoteContext";
import { Issue, IssueStatus } from "../../Issues/types/issues";
import { EventAction, EventNamespace } from "../types/events";
import { PointReveal } from "../types/vote.interface";
import { useMemo } from "react";

export const useRevealVote = () => {
  const { socket, roomId, isHost, room } = useRoomContext();
  const { issues } = useIssuesContext();
  const {
    selectedCard,
    setSelectedCard,
    setIsCardRevealed,
    allPoint,
    setCustomPoint,
    setAllPoint,
    customPoint,
    totalVote,
    setTotalVote,
  } = useVoteContext();
  const { allParticipants } = useUserContext();
  const { sendMessage } = useSocketEvent(socket, EventNamespace.Broadcast);

  const revealCard = () => {
    setSelectedCard(null);
    setIsCardRevealed(true);
    console.log(
      "onRevealVote.setTotalVote",
      allParticipants.filter((user) => user.isVoting)
    );
    setTotalVote(
      allParticipants
        .filter((user) => user.isVoting)
        .map((u) => ({
          id: u.id.toString(),
          point: selectedCard ?? "",
          createdBy: u,
          createdAt: new Date().toISOString(),
        }))
    );

    socket.emit("reveal", {
      roomId,
      issue: issues.find(
        (issue) => issue.id && issue.status === IssueStatus.Voting
      ),
    });
  };

  const submitVote = () => {
    if (!room) {
      return;
    }

    const issueCurrentVoting = issues.find(
      (issue) => issue.status === IssueStatus.Voting
    );

    if (!issueCurrentVoting) {
      alert("Please select a card before revealing!");
      return;
    }

    if (!allPoint || allPoint.length === 0) {
      console.warn("No votes available!");
      return;
    }

    //payload issues
    const payload = {
      type: EventAction.Update,
      data: {
        ...issueCurrentVoting,
        status: IssueStatus.Completed,
        storyPoints: selectedCard,
      },
    };

    const newVoteSessionIssue: Issue = {
      ...issueCurrentVoting,
      latestVoteSession: {
        ...issueCurrentVoting.latestVoteSession,
        votes: totalVote,
      },
    };

    console.log("newVoteSessionIssue", newVoteSessionIssue);

    socket.emit("broadcast", {
      type: "totalVote",
      data: newVoteSessionIssue,
    });

    socket.emit("issue", payload); // ส่งข้อมูลไปที่ socket.emit() ครั้งเดียว
    setSelectedCard(null);
    setIsCardRevealed(true);
    setCustomPoint(""); // รีเซ็ต customPoint
  };

  const handleCustomPointEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customPoint) {
      // ตรวจสอบว่า customPoint มีอยู่แล้วใน allPoint หรือไม่
      const existingCard = allPoint.find((card) => card.point === customPoint);

      console.log("Existing Card:", existingCard);
      console.log("Custom Point to add:", customPoint);

      if (existingCard) {
        // เพิ่ม count ของการ์ดเดิม (แปลงเป็น string)
        setAllPoint((prev) =>
          prev.map((card) =>
            card.point === customPoint
              ? { ...card, count: card.count + 1 } // แปลงเป็น string
              : card
          )
        );
      } else {
        // ถ้าไม่มีการ์ดเดิม เพิ่มการ์ดใหม่ (ตั้ง count เป็น "1")
        const newCard = { point: customPoint, count: 0, isCustom: true }; // ตั้ง count เป็น string
        console.log("Adding new custom point:", newCard);

        // ✅ ส่ง custom point ไปให้ทุกคน
        sendMessage({
          type: "customPoint",
          data: newCard,
        });

        setAllPoint((prev) => [...prev, newCard]);
      }

      // ตั้งค่า selectedCard เป็น customPoint ที่กรอก
      setSelectedCard(customPoint);
      setCustomPoint(""); // รีเซ็ต customPoint

      console.log("All Points after update:", allPoint);
    }
  };

  const handleRemoveCustomPoint = (pointToRemove: PointReveal) => {
    setAllPoint((prev) =>
      prev.filter((card) => card.point !== pointToRemove.point)
    );

    // ✅ ส่ง custom point ไปให้ทุกคน
    sendMessage({
      type: "RemoveCustomPoint",
      data: pointToRemove,
    });
  };

  const hostButtonReveal = useMemo(() => {
    return allParticipants.filter((user) => user.isVoting).length > 0 && isHost;
  }, [allParticipants, isHost]);

  return {
    hostButtonReveal,
    revealCard,
    submitVote,
    handleCustomPointEnter,
    handleRemoveCustomPoint,
    setSelectedCard,
    setIsCardRevealed,
    setAllPoint,
    setCustomPoint,
    sendMessage,
  };
};
