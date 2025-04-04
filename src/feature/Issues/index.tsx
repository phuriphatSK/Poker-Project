import { Issue, IssueEvent } from "./types/issues";
import { EventAction } from "../Room/types/events";
import { useSocketEvent } from "socket.io-react-hook";
import { useRoomContext } from "../../hooks/useRoomContext";
import { useIssuesContext } from "../../hooks/useIssuesContext";
import IssuesHeader from "./components/issues/IssuesHeader";
import IssuesList from "./components/issues/IssuesList";
import IssueModal from "./components/modal/ModalTaskAddEdit";

import { useState } from "react";
import { useIssues } from "./hooks/useIssues";
import IssueDetailModal from "./components/modal/ModalTaskDetail";

export default function Issues() {
  const { socket, setIsModalOpen, isModalOpen } = useRoomContext();
  const { issues, setIssues, currentActionIssue, setCurrentActionIssue } =
    useIssuesContext();
  const {
    handleAddOrUpdateIssue,
    handleDeleteTask,
    handleStartVoting,
    handleEditTask,
    handleRevote,
  } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useSocketEvent(socket, "issue", {
    onMessage({ type, data }: IssueEvent) {
      if (!data) return;
      setIssues((prev) => {
        switch (type) {
          case EventAction.Create:
            return [...prev, data];
          case EventAction.Update:
            return prev.map((issue) =>
              issue.id === data.id
                ? { ...data, latestVoteSession: issue.latestVoteSession }
                : issue
            );
          case EventAction.Delete:
            return prev.filter((issue) => issue.id !== data.id);
          case EventAction.BulkCreate:
            return [...prev, ...(Array.isArray(data) ? data : [])]; // ✅ แก้ให้รองรับเฉพาะ array
          case EventAction.BulkDelete:
            return Array.isArray(data)
              ? prev.filter((issue) => !data.includes(issue.id))
              : prev;
          default:
            return prev;
        }
      });
    },
  });

  return (
    <div className="h-[75vh]">
      <IssuesHeader issuesCount={issues.length} />
      <IssuesList
        issues={issues}
        onViewTask={(issue) => {
          setSelectedIssue(issue);
          setIsDetailModalOpen(true);
        }}
        onAddIssue={() => setIsModalOpen(true)}
        onStartVoting={handleStartVoting}
        onRevote={handleRevote}
      />
      <IssueModal
        onClose={() => setIsModalOpen(false)}
        onDelete={handleDeleteTask}
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddOrUpdateIssue}
        currentIssue={currentActionIssue}
        setCurrentIssue={setCurrentActionIssue}
      />
      <IssueDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        issue={selectedIssue}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
