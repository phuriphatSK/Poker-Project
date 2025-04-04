import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "../components/Navbar";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Navbar />
      <div className="bg-[#F5F1FA] p-10 max-sm:p-5 max-sm:h-screen">
        <div className="grid lg:grid-cols-2 lg:h-[calc(100vh-138px)] items-center p-10 gap-10 bg-white rounded-lg max-sm:h-5/6 max-sm:gap-0 max-sm:p-0">
          <div className="flex flex-col gap-8 p-8 max-sm:p-9 ">
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-[#5B3F8C]">
                Swift Poker
              </h1>
              <p className="text-sm md:text-sm text-[#333333] font-bold ">
                Invite your team to vote on tickets, evaluate the results of
                each voting and download the voting session results.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-10 justify-center lg:justify-start max-sm:items-center">
              <Link to="/joinid" search={{ error: undefined }}>
                <button className="px-4 md:px-5 py-2 text-base md:text-base md:text-center bg-white text-[#A073CC] border border-[#A073CC] rounded-md transition hover:bg-gray-200 font-semibold">
                  Join a Game
                </button>
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-10 max-sm:p-0">
            <div className="">
              <img src="/Home.svg" alt="table-poker" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Route;
