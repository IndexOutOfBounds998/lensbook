import {
  Comment,
  Post,
  ProfileOwnedByMe,
  useCreateMirror,
} from "@lens-protocol/react-web";
import { Button, message } from "antd";
import { useTranslation } from "react-i18next";
type MirrorButtonProps = {
  publication: Post | Comment;
  publisher: ProfileOwnedByMe;
};

export default function MirrorButton({
  publication,
  publisher,
}: MirrorButtonProps) {
  const { execute: create, isPending, error } = useCreateMirror({ publisher });
  const { t } = useTranslation();
  if (error) {
    message.error(error.message);
  }
  if (!publication.canMirror.result) {
    return null;
  }
  return (
    <Button
      className="w-[70px] rounded-3xl bg-[#50b674] cursor-pointer p-[5px] text-[#fff] text-center"
      loading={isPending}
      onClick={() =>
        create({
          publication: publication,
        })
      }
      disabled={isPending || publication.isMirroredByMe}
    >
      {t("sharebtn")}
    </Button>
  );
}
