import React, { Suspense } from "react";
import { Navbar } from "../Room/components/Navbar";
import { Board } from "../Room/layout/Board/index";
import { UserRole } from "./layout/UserRole/index";
import { RoomContextProvider } from "./contexts/roomContext";
import { CardPick } from "./components/CardPick";
import { IssuesList } from "./layout/Issues";
import { UserContextProvider } from "./contexts/userContext";
import { VoteContextProvider } from "./contexts/voteContext";
import { IssuesContextProvider } from "./contexts/issuesContext";
import { PopoverIssuesContextProvider } from "./components/popoverissuemobile/contexts/popoverissuesContext";

const Room: React.FC = () => {
  return (
    <RoomContextProvider>
      <UserContextProvider>
        <VoteContextProvider>
          <IssuesContextProvider>
            <PopoverIssuesContextProvider>
              <Suspense fallback={<div>Loading...</div>}>
                <div className="flex flex-col bg-[#F5F1FA] text-gray-800 h-screen">
                  <Navbar />
                  {/* Main Content */}
                  <main className="grid grid-cols-8 h-[calc(100vh-192px)] max-xl:flex max-xl:justify-center">
                    {/* Left Section: Timer and Tabs */}
                    <UserRole />

                    {/* Main Section: Reveal Cards */}
                    <Board />

                    {/* Right Section: Issues List */}
                    <IssuesList />
                  </main>
                  {/* Footer */}
                  <CardPick />
                </div>
              </Suspense>
            </PopoverIssuesContextProvider>
          </IssuesContextProvider>
        </VoteContextProvider>
      </UserContextProvider>
    </RoomContextProvider>
  );
};

export default Room;
