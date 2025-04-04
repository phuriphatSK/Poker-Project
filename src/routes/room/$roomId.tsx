import { createFileRoute, redirect } from "@tanstack/react-router";
import Room from "../../feature/Room/index";
import { RoomParticipantRole } from "../../feature/Room/types/room.interface";
import { fetchIDRoomInfo } from "../../feature/Room/api";
import "../../feature/Room/styles/loaderstye.css";

export const Route = createFileRoute("/room/$roomId")({
  beforeLoad: async ({ params }) => {
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    // ถ้าไม่มี accessToken จะทำการ redirect ไปยัง /joinqr/${roomId}
    if (!accessToken) {
      return redirect({ to: `/joinqr/${params.roomId}` });
    }

    await new Promise((r) => setTimeout(r, 2000));

    try {
      await fetchIDRoomInfo(params.roomId);
    } catch {
      throw redirect({ to: "/joinid", search: { error: "Room not found." } });
    }
  },

  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    role: search.role as RoomParticipantRole | undefined,
  }),

  pendingComponent: () => (
    <main className="h-dvh w-full flex flex-col items-center justify-center">
      <div className="loader"></div>
    </main>
  ),
});

function RouteComponent() {
  return (
    <>
      <Room />
    </>
  );
}
