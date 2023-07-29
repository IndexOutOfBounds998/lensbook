import { message, Button } from "antd";
import { useTranslation } from "react-i18next";

export default function FollowButtonWithOutProfile() {
  const [messageApi, contextHolder] = message.useMessage();

  const { t } = useTranslation();

  return (
    <>
      {contextHolder}
      <Button
        className="flex items-center cursor-pointer justify-center rounded-3xl w-[74px] h-[40px] text-[15px]"
        style={{ background: "#ff2442", color: "#fff" }}
      >
        {t("followButton")}
      </Button>
    </>
  );
}
