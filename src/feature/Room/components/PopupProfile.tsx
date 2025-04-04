import { Button, ConfigProvider, Flex, Popover } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useUserLogout } from "../../Login/hooks/useQueryLogout";

const text = (
  <div className="max-sm:p-5 ">
    <span className="text-xl text-center">Profile</span>
  </div>
);

// Function to remove cookie
const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const PopupProfile = ({ avatarUrl }: { avatarUrl?: string }) => {
  const navigate = useNavigate(); // Hook สำหรับเปลี่ยนเส้นทางไปยังหน้าอื่น
  const queryClient = useQueryClient(); // ใช้เพื่อล้างแคชข้อมูลผู้ใช้

  const logout = useUserLogout(); // Hook สำหรับ Logout

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        removeCookie("accessToken");
        queryClient.invalidateQueries({ queryKey: ["UserInfo"] });
        navigate({ to: "/", replace: true });
      },
      onError: (error) => {
        console.error("Logout failed:", error);
      },
    });
  };

  // เนื้อหาของ Popover
  const content = (
    <div className="flex flex-col max-sm:pl-5 ">
      <button
        className="w-full h-10 flex justify-start items-center py-5 text-red-500 hover:bg-gray-100"
        onClick={handleLogout} // เรียก handleLogout เมื่อกดปุ่ม
      >
        Logout
      </button>
    </div>
  );

  return (
    <ConfigProvider>
      <Flex justify="center" align="center" style={{ whiteSpace: "nowrap" }}>
        <Popover
          placement="bottom"
          title={text}
          content={content}
          trigger="click"
          arrow={false}
        >
          <Button className="w-10 h-10 rounded-3xl bg-transparent p-0 border-none">
            <div className="w-full h-full overflow-hidden rounded-3xl">
              <img
                src={avatarUrl || "/profile.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </Button>
        </Popover>
      </Flex>
    </ConfigProvider>
  );
};
