import { createFileRoute } from "@tanstack/react-router";
import JoinID from "../feature/Room/components/Joinid";
import Navbar from "../components/Navbar";
import { useEffect, useRef } from "react";
import { App } from "antd";

export const Route = createFileRoute("/joinid")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    error: search.error as string | undefined,
  }),
});

const errorKey = "error";

function RouteComponent() {
  const { notification } = App.useApp();
  const error = Route.useSearch({ select: (search) => search.error });

  const isFirstRender = useRef(true); // ใช้ useRef เพื่อเช็คว่าหน้าโหลดครั้งแรกไหม

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // เปลี่ยนเป็น false หลังจาก render ครั้งแรก
      return;
    }

    if (error) {
      notification.error({ message: error, key: errorKey });
    }
  }, [error, notification]);

  return (
    <>
      <Navbar />
      <div>
        <JoinID />
      </div>
    </>
  );
}
