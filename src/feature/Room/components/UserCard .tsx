import { Button, Col, Row, Tooltip, Typography } from "antd";
import { useIsFetching } from "@tanstack/react-query";
import { useVoteContext } from "../../../hooks/useVoteContext";
import { UserWithVote } from "../types/user.interface";

export interface Props {
  users: UserWithVote[];
}

export const UserCard = ({ users }: Props) => {
  const { isCardRevealed } = useVoteContext();
  const isFetching = useIsFetching();

  return (
    <Row gutter={32}>
      {users.map((user) =>
        user ? (
          <Col
            key={user.id}
            className="flex flex-col items-center max-lg:!px-3 max-sm:!px-1"
          >
            <div className="flex flex-col items-center gap-2 w-9">
              <div className="flex items-center justify-center w-8 h-16 bg-white hover:bg-purple-400 rounded-lg shadow-lg max-sm:w-7 max-sm:h-12">
                {isCardRevealed ? (
                  user.selectedCard !== null ? (
                    <span className="w-full h-full justify-center items-center">
                      <div className="flex justify-center py-5 max-sm:py-3  text-[#5A378C] text-lg font-medium">
                        {user.selectedCard}
                      </div>
                    </span>
                  ) : (
                    ""
                  )
                ) : user.isVoting ? (
                  <img
                    src="/vote.png"
                    alt="vote"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  ""
                )}
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                <Button className="w-full h-9 rounded-3xl bg-transparent p-0 max-sm:w-7 max-sm:h-7 max-md:w-7 max-md:h-7">
                  <div className="w-full h-full overflow-hidden rounded-3xl">
                    <img
                      src={user.avatarUrl ?? "/profile.jpg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Button>
                <Tooltip placement="bottom" title={user.displayName} arrow>
                  <Typography.Text
                    className="text-black text-sm w-[55px] text-center max-sm:text-xs max-md:text-xs"
                    ellipsis
                  >
                    {isFetching > 0
                      ? "Loading..."
                      : user.displayName || "Guest"}
                  </Typography.Text>
                </Tooltip>
              </div>
            </div>
          </Col>
        ) : null
      )}
    </Row>
  );
};
