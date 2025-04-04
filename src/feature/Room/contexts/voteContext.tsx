/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { CurrentVote, PointReveal } from "../types/vote.interface";

interface VoteContext {
  thrownEmojis: {
    userId: string;
    emoji: string;
  }[];
  currentVote: CurrentVote | undefined;
  selectedCard: string | null;
  hasVotes: boolean;
  isCardRevealed: boolean;
  allPoint: PointReveal[];
  customPoint: string;
  setSelectedCard: React.Dispatch<React.SetStateAction<string | null>>;
  setIsCardRevealed: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentVote: React.Dispatch<React.SetStateAction<CurrentVote | undefined>>;
  setAllPoint: React.Dispatch<React.SetStateAction<PointReveal[]>>;
  setCustomPoint: React.Dispatch<React.SetStateAction<string>>;
  setHasVotes: React.Dispatch<React.SetStateAction<boolean>>;
  totalVote: CurrentVote[];
  setTotalVote: React.Dispatch<React.SetStateAction<CurrentVote[]>>;
  setThrownEmojis: React.Dispatch<
    React.SetStateAction<
      {
        userId: string;
        emoji: string;
      }[]
    >
  >;
}

export const VoteContext = createContext<VoteContext | null>(null);
export const VoteContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentVote, setCurrentVote] = useState<CurrentVote>(); // use for set on local when user click on card
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isCardRevealed, setIsCardRevealed] = useState<boolean>(false);
  const [allPoint, setAllPoint] = useState<PointReveal[]>([]);
  const [customPoint, setCustomPoint] = useState<string>("");
  const [hasVotes, setHasVotes] = useState<boolean>(false);
  const [totalVote, setTotalVote] = useState<CurrentVote[]>([]);
  const [thrownEmojis, setThrownEmojis] = useState<
    { userId: string; emoji: string }[]
  >([]);
  // const [] = useState<>;

  return (
    <VoteContext.Provider
      value={{
        thrownEmojis,
        setThrownEmojis,
        hasVotes,
        setHasVotes,
        customPoint,
        setCustomPoint,
        allPoint,
        setAllPoint,
        currentVote,
        setCurrentVote,
        selectedCard,
        setSelectedCard,
        isCardRevealed,
        setIsCardRevealed,
        totalVote,
        setTotalVote,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};
