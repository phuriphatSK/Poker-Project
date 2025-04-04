import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import Navbar from "../components/Navbar";
import { Recent } from "../feature/Recent";

export const Route = createFileRoute("/atlassian")({
  beforeLoad: () => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    // ถ้าไม่มี accessToken จะทำการ redirect ไปยัง /
    if (!accessToken) {
      return redirect({ to: `/` });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <div className="bg-[#F5F1FA] p-10 max-sm:p-5">
        <div className="grid lg:grid-cols-2 lg:h-[calc(100vh-150px)] items-center p-10 gap-10 bg-white rounded-lg max-sm:h-full max-sm:gap-0 max-sm:p-0">
          <div className="flex flex-col gap-8 p-8 max-sm:p-9">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl md:text-4xl font-semibold  leading-tight text-[#5B3F8C]">
                Swift Poker
              </h1>
              <p className="text-sm md:text-lg text-gray-600 font-semibold">
                Invite your team to vote on tickets, evaluate the results of
                each voting and download the voting session results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start max-sm:items-center">
              <Link to="/createroom">
                <button className="px-9 md:px-5 py-2 text-base md:text-base md:text-center bg-[#5B3F8C] text-white rounded-lg transition hover:bg-[#8562c2] border max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg max-sm:text-xs">
                  Start a Game
                </button>
              </Link>
              <Link to="/joinid" search={{ error: undefined }}>
                <button className="px-9 md:px-5 py-2 text-base md:text-base md:text-center bg-white text-[#A073CC] border border-[#A073CC] rounded-lg transition hover:bg-gray-200 font-semibold max-sm:w-[157px] max-sm:h-[44px] max-sm:rounded-lg max-sm:text-xs">
                  Join a Game
                </button>
              </Link>
            </div>
          </div>

          {/* Right Section */}

          <div className="p-10 max-sm:p-0 ">
            <div className="">
              <img src="/Home.svg" alt="table-poker" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8">
          <div className="flex flex-col pl-2 max-sm:pt-8">
            <span className="text-[#5B3F8C] text-2xl font-extrabold max-sm:text-xl">
              Your Recent Room
            </span>
            <span className="text-[#333333] font-bold text-sm max-sm:text-xs">
              Meetings that you have either created or joined recently
            </span>
          </div>
          <div className="pl-2">
            <Recent />
          </div>
        </div>
      </div>
    </>
  );
}
