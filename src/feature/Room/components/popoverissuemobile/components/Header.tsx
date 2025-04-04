import { useRoomContext } from "../../../../../hooks/useRoomContext";
import { AddissuesJira } from "../../../../Issues/components/table/AddissuesJira";
import { IssuesTableListAll } from "../../../../Issues/components/table/IssuesTableListAll";
import { Issue } from "../../../../Issues/types/issues";

interface IssuesListProps {
  issues: Issue[];
}

export const Header = ({ issues }: IssuesListProps) => {
  const { isHost } = useRoomContext();

  return (
    <>
      <div className="pt-2 pr-2 pb-3 pl-4 w-full">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold ">Issues</h2>
          {isHost && (
            <div className="text-xl flex gap-2 ">
              <AddissuesJira />
              <IssuesTableListAll />
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">{issues.length} issues</p>
        </div>
      </div>
    </>
  );
};
