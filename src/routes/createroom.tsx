import { createFileRoute, redirect } from "@tanstack/react-router";

import Navbar from "../components/Navbar";
import CreateRoomPoker from "../feature/Room/components/Create";

export const Route = createFileRoute("/createroom")({
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
      <div>
        <CreateRoomPoker />
      </div>
    </>
  );
}
