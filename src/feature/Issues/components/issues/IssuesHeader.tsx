import { useRoomContext } from "../../../../hooks/useRoomContext";
import { AddissuesJira } from "../table/AddissuesJira";
import { IssuesTableListAll } from "../table/IssuesTableListAll";

interface IssuesHeaderProps {
  issuesCount: number;
}

export default function IssuesHeader({ issuesCount }: IssuesHeaderProps) {
  const { isHost } = useRoomContext();
  return (
    <div className="pt-3 pr-1 pb-5 pl-1 bg-transparent w-full relative sm:hidden lg:block md:block max-sm:hidden ">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold mb-4">Issues</h2>
        {isHost && (
          <div className="text-xl flex gap-2">
            <AddissuesJira />
            <IssuesTableListAll />
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <p className="font-semibold">{issuesCount} issues</p>
      </div>
    </div>
  );
}
