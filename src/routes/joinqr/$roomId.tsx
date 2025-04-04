import { createFileRoute } from "@tanstack/react-router";
import Navbar from "../../components/Navbar";
import JoinQR from "../../feature/Room/components/Joinqr";
import { RoomParticipantRole } from "../../feature/Room/types/room.interface";

export const Route = createFileRoute("/joinqr/$roomId")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    role: search.role as RoomParticipantRole | undefined,
  }),
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <div>
        <JoinQR />
      </div>
    </>
  );
}
