// import { useUserContext } from "../../../hooks/useUserContext";
import { useUserContext } from "../../../hooks/useUserContext";
import { Issue } from "../../Issues/types/issues";
import { Room } from "../types/room.interface";

export const CardList: React.FC<{
  selectedCard: string | null;
  onCardClick: (card: string) => void;
  storyPoints: Room | null;
  currentVotingIssue: Issue | null;
}> = ({ selectedCard, onCardClick, storyPoints, currentVotingIssue }) => {
  const isVotingActive = !!currentVotingIssue; // ถ้ามี issue ที่กำลัง voting อยู่
  const { currentParicipant } = useUserContext();

  if (currentParicipant.isInspector) return null;
  return (
    <div className="flex sm:justify-center items-center overflow-x-auto pt-10 w-full px-2 gap-1 max-sm:pt-12 max-md:pt-12 max-lg:pt-12">
      {storyPoints?.settings?.storyPoint?.data?.map((card) => (
        <button
          key={card}
          className={`w-14 min-w-14 md:min-w-9 h-24 shadow-inner rounded-xl transition-transform duration-100 ease-in-out max-sm:w-12 max-sm:h-20 max-md:w-12 max-md:h-20 max-lg:w-12 max-lg:h-20
             ${selectedCard === card ? "bg-[#5A378C] text-white translate-y-[-40px] font-semibold" : "bg-slate-100 text-[#5A378C]  font-semibold"}
             ${!isVotingActive ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => isVotingActive && onCardClick(card)}
          disabled={!isVotingActive} // ✅ ปิดการกดปุ่มถ้ายังไม่ Start Voting
        >
          {card}
        </button>
      ))}
    </div>
  );
};
