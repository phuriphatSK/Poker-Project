/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { Issue } from "../../../../Issues/types/issues";

interface PopoverIssuesContext {
  isDetailModalOpen: boolean;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIssue: React.Dispatch<React.SetStateAction<Issue | null>>;
  issue: Issue | null;
  isConfirmOpen: boolean;
  isOpenDetail: boolean;
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenEdit: boolean;
  setIsOpenEdit: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIssueId: number | null;
  setSelectedIssueId: React.Dispatch<React.SetStateAction<number | null>>;
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PopoverIssuesContext = createContext<PopoverIssuesContext | null>(
  null
);
export const PopoverIssuesContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  return (
    <PopoverIssuesContext.Provider
      value={{
        isDetailModalOpen,
        setIsDetailModalOpen,
        isModalOpen,
        setIsModalOpen,
        isConfirmOpen,
        issue,
        setIssue,
        isOpenDetail,
        setIsOpenDetail,
        isOpenEdit,
        setIsOpenEdit,
        selectedIssueId,
        setSelectedIssueId,
        setIsConfirmOpen,
      }}
    >
      {children}
    </PopoverIssuesContext.Provider>
  );
};
