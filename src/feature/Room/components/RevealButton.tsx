import { Button } from "antd";
import { useRoomContext } from "../../../hooks/useRoomContext";
import { useSocketEvent } from "socket.io-react-hook";
import { useVoteContext } from "../../../hooks/useVoteContext";
import { useUserContext } from "../../../hooks/useUserContext";
import {
  CurrentVote,
  PointReveal,
  RevealVote,
} from "./../types/vote.interface";
import { UserWithVote } from "../types/user.interface";
import { EventNamespace } from "../types/events";
import { BiRevision } from "react-icons/bi";
import { useRevealVote } from "./../hooks/useRevealVote";
import { useQueryClient } from "@tanstack/react-query";
import { useIssuesContext } from "../../../hooks/useIssuesContext";
import { GuestInfoResponse } from "../../Login/api";
import { RevealType } from "../types/room.interface";

export const RevealButton = () => {
  const queryClient = useQueryClient();
  const { socket, isHost } = useRoomContext();
  const {
    revealCard,
    submitVote,
    handleCustomPointEnter,
    handleRemoveCustomPoint,
    hostButtonReveal,
  } = useRevealVote();
  const {
    selectedCard,
    setSelectedCard,
    isCardRevealed,
    setIsCardRevealed,
    allPoint,
    setAllPoint,
    customPoint,
    setCustomPoint,
  } = useVoteContext();
  const { setAllUsers } = useUserContext();
  const { setIssues } = useIssuesContext();

  useSocketEvent(socket, "reveal", {
    onMessage(reveal: RevealVote) {
      const { votes, type } = reveal;

      if (type === RevealType.Timeout) {
        setIsCardRevealed(true);
        setSelectedCard(null);
      }
      const handleShowPoint = (votes: CurrentVote[]) => {
        setIsCardRevealed(true);
        setSelectedCard(null);

        const updateUser = (users: UserWithVote[]) => {
          return users.map((user) => {
            const vote = votes.find((vote) => vote.createdBy?.id === user.id);
            if (vote) {
              return { ...user, selectedCard: vote.point };
            }
            return user;
          });
        };

        // รวมการอัพเดท state ของทุกฝั่ง
        setAllUsers((prev) => updateUser(prev));

        const allPoint = votes.map((vote) => vote.point);

        const uniq = new Map();
        allPoint.forEach((point) => {
          uniq.set(point, (uniq.get(point) || 0) + 1);
        });

        const uniquePoints: PointReveal[] = [...uniq.entries()].map(
          ([point, count]) => ({ point, count })
        );

        // console.log("uniquePoints", uniquePoints);
        setAllPoint(uniquePoints);
      };
      handleShowPoint(votes);
    },
  });

  const { sendMessage } = useSocketEvent(socket, EventNamespace.Broadcast);

  useSocketEvent(socket, EventNamespace.Broadcast, {
    onMessage({ type, data }) {
      if (type === "revote") {
        console.log("Revote event received:", data.message);

        // รวมการรีเซ็ตค่าในครั้งเดียว
        const resetUserState = (users: UserWithVote[]) =>
          users.map((user) => ({
            ...user,
            selectedCard: null,
            isVoting: false,
          }));

        setAllUsers(resetUserState);

        queryClient.setQueryData(
          ["me"],
          (prevMe: UserWithVote | undefined) => ({
            ...prevMe,
            isVoting: false,
            selectedCard: null,
          })
        );

        setSelectedCard(null);
        setIsCardRevealed(false);
        setAllPoint([]);
      }

      if (type === "customPoint") {
        console.log("Custom Point received:", data);

        setAllPoint((prev) => {
          const existingCard = prev.find((card) => card.point === data.point);
          if (existingCard) {
            return prev.map((card) =>
              card.point === data.point
                ? { ...card, count: card.count + 1 }
                : card
            );
          }
          return [...prev, data];
        });
      }

      if (type === "RemoveCustomPoint") {
        setAllPoint((prev) => prev.filter((card) => card.point !== data.point));
      }

      if (type === "totalVote") {
        console.log("totalVote event received:", data);
        setSelectedCard(null);
        setIsCardRevealed(true);
        setCustomPoint(""); // รีเซ็ต customPoint
        setIssues((prev) =>
          prev.map((issue) => (issue.id === data.id ? data : issue))
        );
      }
      if (type === "BulkDelete") {
        console.log("BulkDelete event received:", data);
        setIssues((prev) =>
          prev.filter((issue) => !data.id.includes(issue.id))
        );
      }

      if (type === "updateDisplayName") {
        console.log("User updated display name:", data);

        // อัปเดตข้อมูลชื่อของผู้ใช้ใน query cache
        queryClient.setQueryData(
          ["UserInfo"],
          (prevData: GuestInfoResponse) => {
            if (!prevData) return prevData;
            return prevData.id === data.userId
              ? { ...prevData, displayName: data.newDisplayName }
              : prevData;
          }
        );
        queryClient.invalidateQueries({ queryKey: ["UserInfo"] });
      }
    },
  });

  return (
    <div className="bg-[#FEC360] rounded-lg px-16 max-sm:px-4 text-center w-[480px] h-[195px] flex items-center justify-center max-sm:w-[280px] max-sm:h-[200px] max-md:w-[400px] max-md:h-[204px]  m-4 ">
      {!isCardRevealed ? (
        hostButtonReveal ? (
          <div className="flex gap-3 max-sm:flex-col max-md:flex-col max-lg:flex-col">
            <Button
              className="p-5 border border-[#5A378C] text-[#5A378C] rounded-md hover:bg-[#5A378C] hover:text-white font-semibold flex items-center gap-2"
              onClick={async () => {
                setSelectedCard(null); // รีเซ็ตการ์ดของตัวเองเมื่อรีโหวต
                await sendMessage({
                  type: "revote",
                  data: {
                    message: "Revote started. Please select your new vote.",
                  },
                });
              }}
            >
              <BiRevision />
              Revote
            </Button>

            <Button
              className="p-5 bg-[#5A378C] text-white rounded-md hover:bg-purple-700 font-semibold"
              onClick={revealCard}
            >
              Reveal Vote
            </Button>
          </div>
        ) : isHost ? (
          <p className="text-[#5A378C] font-semibold max-sm:font-medium max-md:font-medium">
            Pick a Card Below
          </p>
        ) : (
          <p className="text-[#5A378C] font-semibold max-sm:font-medium max-md:font-medium">
            Waiting for host . . .
          </p>
        )
      ) : (
        <>
          <div className="flex w-full flex-col items-center max-sm:flex-col max-md:flex-col max-lg:flex-col">
            <p className="text-[#5A378C] font-semibold text-sm mb-2 max-sm:text-xs max-md:text-xs max-lg:text-xs">
              Please select a card score
            </p>

            <div className="flex gap-3 max-w-full overflow-auto pt-2 mx-auto">
              {allPoint?.map((vote) => (
                <div
                  key={vote.point}
                  className="flex flex-col items-center cursor-pointer relative"
                  onClick={() => {
                    console.log("votepoint", vote.point);
                    // ตรวจสอบว่าผู้ใช้ไม่ได้เป็น host
                    if (!isHost) {
                      setSelectedCard(vote.point);
                      alert("Waiting for host . . .");
                    } else {
                      // เก็บคะแนนที่ผู้ใช้เลือกไว้ใน state
                      setSelectedCard(vote.point);
                    }
                  }}
                >
                  <div
                    className={`px-3 py-2 rounded-lg shadow-md w-[40px] h-[70px] flex items-center justify-center max-sm:w-10 max-sm:h-[55px] 
                ${selectedCard === vote.point ? "bg-[#5A378C] text-white" : "bg-white text-[#5A378C]"}`}
                  >
                    <p className="text-lg font-semibold">{vote.point}</p>
                  </div>
                  {!vote.isCustom ? (
                    <p className="text-[#333333] text-xs mt-2 ">
                      {vote.count} Vote
                    </p>
                  ) : (
                    <p className="text-[#333333] text-xs mt-2">Custom</p>
                  )}
                  {/* ✅ ปุ่มลบสำหรับ Custom Point */}
                  {vote.isCustom && (
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-md"
                      onClick={(e) => {
                        e.stopPropagation(); // ป้องกันการเลือกการ์ดตอนกดลบ
                        handleRemoveCustomPoint(vote);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <div className="flex flex-col items-center">
                <div
                  className={`border-2 border-dashed px-3 py-2 rounded-lg shadow-md w-[40px] h-[70px] flex items-center justify-center max-sm:w-9 max-sm:h-[52px]  
              ${selectedCard === "Custom" ? "bg-white border-[#D48F35]" : "bg-[#FFAA1B] border-[#E69500]"}`}
                  onClick={() => setSelectedCard("Custom")}
                >
                  {selectedCard === "Custom" ? (
                    <input
                      value={customPoint}
                      onChange={(e) => setCustomPoint(e.target.value)}
                      onKeyDown={handleCustomPointEnter}
                      className="w-8 text-center text-[#5A378C] font-semibold bg-transparent outline-none "
                      placeholder="-"
                    />
                  ) : (
                    <p className="text-lg font-semibold">+</p>
                  )}
                </div>
                <p className="text-[#333333] text-xs mt-2">Custom</p>
              </div>
            </div>

            {isHost && (
              <div className="flex gap-3 mt-3 max-sm:flex-col max-md:gap-2 max-sm:gap-2 max-lg:gap-2 max-sm:mt-2 max-md:mt-2 max-lg:mt-2">
                <Button
                  className="px-4 py-2  border-[#5A378C] text-[#A073CC] rounded-md hover:bg-[#5A378C] hover:text-white font-semibold flex items-center gap-2"
                  onClick={async () => {
                    setSelectedCard(null); // รีเซ็ตการ์ดของตัวเองเมื่อรีโหวต
                    await sendMessage({
                      type: "revote",
                      data: {
                        message: "Revote started. Please select your new vote.",
                      },
                    });
                  }}
                >
                  <BiRevision />
                  Revote
                </Button>

                <Button
                  className="px-4 py-2 bg-[#5A378C] text-white rounded-md hover:bg-purple-700 font-semibold flex items-center gap-2 border-[transparent]"
                  onClick={submitVote}
                >
                  <img src="/submit.svg" />
                  Submit
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
