import { useState } from "react";
import { Button, Popover } from "antd";
import { AiOutlineBars } from "react-icons/ai";
import { List } from "./components/List";
import { Header } from "./components/Header";
import { AddEdit } from "./components/modal/AddEdit";
import { Detail } from "./components/modal/Detail";
import { useIssuesContext } from "../../../../hooks/useIssuesContext";
import { useIssues } from "../../../Issues/hooks/useIssues";
import { usePopoverIssuesContext } from "../../../../hooks/usePopoverIssuesContext";

export const PopoverIssue = () => {
  const [open, setOpen] = useState(false);

  const { issues, currentActionIssue, setCurrentActionIssue } =
    useIssuesContext();
  const {
    handleAddOrUpdateIssue,
    handleDeleteTask,
    handleStartVoting,
    handleRevote,
  } = useIssues();

  const { setIsModalOpen, setIsDetailModalOpen } = usePopoverIssuesContext();

  const content = (
    <div className="h-[73vh]">
      {/* Issue Header */}
      <Header issues={issues} />
      {/* Issue List */}
      <List
        issues={issues}
        onStartVoting={handleStartVoting}
        onRevote={handleRevote}
        setCurrentIssue={setCurrentActionIssue}
      />
      {/* Modal Add Edit */}
      <AddEdit
        setCurrentIssue={setCurrentActionIssue}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddOrUpdateIssue}
        currentIssue={currentActionIssue}
        onClose={() => setIsModalOpen(false)}
        onCloseEdit={() => setIsModalOpen(false)}
        onDelete={handleDeleteTask}
      />
      {/* Modal Detail */}
      <Detail
        issues={issues}
        setCurrentIssue={setCurrentActionIssue}
        onClose={() => setIsDetailModalOpen(false)}
        onDelete={handleDeleteTask}
      />
    </div>
  );

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={content}
        placement="bottom"
        trigger="click"
        arrow={false} // เอาลูกศรออก
      >
        <Button className="border-[#A073CC] w-[44px] h-[44px] rounded-lg text-[#A073CC]  max-lg:block xl:hidden 2xl:hidden">
          <AiOutlineBars />
        </Button>
      </Popover>
    </>
  );
};
