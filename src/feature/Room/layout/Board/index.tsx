import { UserCard } from "../../components/UserCard ";
import { RevealButton } from "../../components/RevealButton";
import { useUserContext } from "../../../../hooks/useUserContext";

export const Board = () => {
  const { top, bottom, right, left, me } = useUserContext();

  return (
    <div className="flex flex-col col-span-4 items-center justify-center max-sm:pt-5 ">
      {/* ด้านบน */}
      <div className="flex justify-center gap-1">
        {/* <UserCard users={[...top, ...(isSmallScreen ? left : [])]} /> */}
        <UserCard users={top} />
      </div>

      {/* ปุ่มกลาง */}
      <section className="flex items-center justify-center text-center lg:py-5 max-sm:py-2 gap-4 ">
        <div className="flex justify-center gap-1 max-sm:hidden ">
          <UserCard users={left} />
        </div>
        <RevealButton />
        <div className="flex justify-center gap-1 max-sm:hidden ">
          <UserCard users={right} />
        </div>
      </section>

      {/* ด้านล่าง */}
      <div className="flex justify-center gap-7 ">
        {me && <UserCard users={[me]} />}
        <UserCard users={bottom} />
        {/* <UserCard users={[...bottom, ...(isSmallScreen ? right : [])]} /> */}
      </div>
    </div>
  );
};
