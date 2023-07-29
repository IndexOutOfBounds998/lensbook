import {
  AnyPublication,
  CollectState,
  Comment,
  Post,
  ProfileOwnedByMe,
} from "@lens-protocol/react-web";

import { Button, message, Modal } from "antd";

import { useTranslation } from "react-i18next";

import { useCollectWithSelfFundedFallback } from "@/app/hooks/useCollectWithSelfFundedFallback";

import { useEffect, useState } from "react";

type CollectButtonProps = {
  collector: ProfileOwnedByMe;
  publication: Post | Comment;
};

export default function CollectButton({
  collector,
  publication,
}: CollectButtonProps) {
  const [messageApi, contextHolder] = message.useMessage();

  const { t } = useTranslation();

  const {
    execute: collect,
    error,
    isPending,
  } = useCollectWithSelfFundedFallback({ collector, publication });

  const isCollected = publication.hasCollectedByMe;

  useEffect(() => {
    if (!isPending) {
      messageApi.open({
        type: "success",
        content: t("collectSuccess"),
      });
    }
  }, [isPending, messageApi, t]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    if (!collector) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const ShowCollectModal = ({ publication }: { publication: any }) => {
    return (
      <>
        <Modal
          title={t("collect")}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>
            {publication.collectModule.feeOptional
              ? "付费收藏 " +
                publication.collectModule.feeOptional.amount.asset.symbol +
                " 需要支付 " +
                publication.collectModule.feeOptional.amount.value
              : ""}
          </p>
          <Button
            onClick={() => collect()}
            disabled={isCollected || isPending}
            loading={isPending}
            type="link"
            ghost
            icon={
              <i
                className={`iconfont icon-${
                  isCollected ? "star-fill" : "star"
                } cursor-pointer text-[25px] mr-3`}
              />
            }
            className="flex items-center"
          >
            <span className="font-bold">
              {publication.stats.totalAmountOfCollects}
            </span>
          </Button>
        </Modal>
      </>
    );
  };

  const CollectBtn = ({ title }: { title: string }) => (
    <Button
      type="link"
      ghost
      disabled
      className="flex items-center"
      title={title}
    >
      <i className={"iconfont icon-star cursor-pointer text-[25px] mr-3"} />
      <span className="font-bold">
        {publication.stats.totalAmountOfCollects}
      </span>
    </Button>
  );

  switch (publication.collectPolicy.state) {
    case CollectState.COLLECT_TIME_EXPIRED:
      return <CollectBtn title="Collecting ended" />;
    case CollectState.COLLECT_LIMIT_REACHED:
      return <CollectBtn title="Collect limit reached" />;
    case CollectState.NOT_A_FOLLOWER:
      return <CollectBtn title="Only followers can collect" />;
    case CollectState.CANNOT_BE_COLLECTED:
      return <CollectBtn title="Cannot be collected" />;
    case CollectState.CAN_BE_COLLECTED:
      return (
        <>
          <ShowCollectModal publication={publication}></ShowCollectModal>
          <Button
            onClick={() => showModal()}
            disabled={isPending}
            loading={isPending}
            type="link"
            ghost
            icon={
              <i
                className={`iconfont icon-${
                  isCollected ? "star-fill" : "star"
                } cursor-pointer text-[25px] mr-3`}
              />
            }
            className="flex items-center"
          >
            <span className="font-bold">
              {publication.stats.totalAmountOfCollects}
            </span>
          </Button>
        </>
      );
  }
}
