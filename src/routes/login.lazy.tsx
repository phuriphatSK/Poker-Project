import { createLazyFileRoute } from "@tanstack/react-router";
import Login from "../feature/Login/index";
import Navbar from "../components/Navbar";

export const Route = createLazyFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center" }}>
        <Login />
      </div>
    </>
  );
}
