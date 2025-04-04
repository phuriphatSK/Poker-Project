import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CardList } from "./CardList";
import { useRoomContext } from "../../../hooks/useRoomContext";
import { EventAction } from "../types/events";
import { useSocketEvent } from "socket.io-react-hook";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../../../hooks/useUserContext";
import { useVoteContext } from "../../../hooks/useVoteContext";
import { CurrentVote, ListenVoteEvent } from "../types/vote.interface";
import { UserWithVote } from "../types/user.interface";
import { ScrollBar } from "../../../components/ScrollArea";
import { useIssuesContext } from "../../../hooks/useIssuesContext";
import { IssueStatus } from "../../Issues/types/issues";

const isEventFromAnotherUesr = (
  eventData: ListenVoteEvent | CurrentVote
): eventData is ListenVoteEvent => "type" in eventData;

export const CardPick = () => {
  const queryClient = useQueryClient();
  const { socket, room } = useRoomContext();
  const { me, setAllUsers } = useUserContext();
  const {
    isCardRevealed,
    selectedCard,
    setSelectedCard,
    setIsCardRevealed,
    currentVote,
    setCurrentVote,
  } = useVoteContext();
  const { issues } = useIssuesContext();

  async function handleCardClick(card: string) {
    const isNewPick = !selectedCard;
    const isChangeCard = selectedCard !== card;

    const eventType = isNewPick
      ? EventAction.Create
      : isChangeCard
        ? EventAction.Update
        : EventAction.Delete;

    const payload = {
      type: eventType,
      data: {
        ...(eventType !== EventAction.Create ? { id: currentVote?.id } : {}),
        point: card,
        ...(eventType === EventAction.Delete
          ? { voteSessionId: currentVote?.voteSessionId }
          : {}),
      },
    };

    queryClient.setQueryData(["me"], (prevMe: UserWithVote) => ({
      ...prevMe,
      selectedCard: card,
      isVoting: eventType !== EventAction.Delete,
    }));

    try {
      setSelectedCard(selectedCard === card ? null : card);
      setIsCardRevealed(false);
      await voteSocket.sendMessage(payload);

      if (eventType === EventAction.Create) {
        setCurrentVote({ id: "", point: card });
      } else if (eventType === EventAction.Delete) {
        setCurrentVote(undefined);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const voteSocket = useSocketEvent<
    | {
        type: EventAction;
        data: { id: number | string; point: string };
      }
    | CurrentVote
  >(socket, "vote", {
    onMessage(message) {
      // console.log("eventData", message);
      if (isEventFromAnotherUesr(message)) {
        const { data, type } = message;
        const isVoting = !(type === EventAction.Delete);

        // อัปเดต me หากเป็นผู้ใช้ปัจจุบัน
        if (data.id === me?.id) {
          queryClient.setQueryData(
            ["me"],
            (prevMe: UserWithVote | undefined) =>
              prevMe
                ? { ...prevMe, isVoting, selectedCard: data.point }
                : { isVoting, selectedCard: data.point }
          );
        }

        //อัปเดต top,bottom,right,left
        const updateUser = (user: UserWithVote) => {
          if (user.id === data.id) {
            return { ...user, isVoting, selectedCard: data.point };
          }
          return user;
        };

        setAllUsers((prev) => prev.map(updateUser));
      } else {
        // ถ้าไม่ใช่การโหวตจากผู้ใช้คนอื่น อัปเดตข้อมูลการโหวตปัจจุบัน
        setCurrentVote(message);
      }
    },
  });

  const currentVotingIssue = issues.find(
    (issue) => issue.status === IssueStatus.Voting
  ); // 🔹 หา Issue ที่กำลัง Voting อยู่

  return (
    <>
      {!isCardRevealed && (
        <footer className="fixed left-[50%] bottom-2 translate-x-[-50%] w-[100vw]">
          <ScrollArea>
            <CardList
              selectedCard={selectedCard}
              onCardClick={handleCardClick}
              storyPoints={room}
              currentVotingIssue={currentVotingIssue ?? null}
            />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </footer>
      )}
    </>
  );
};
