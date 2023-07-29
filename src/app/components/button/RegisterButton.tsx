import { useActiveWallet, useCreateProfile } from "@lens-protocol/react-web";

import { SmileOutlined } from "@ant-design/icons";

import {
  Button,
  Modal,
  Form,
  Input,
  message,
  notification,
  Popover,
} from "antd";

import { useEffect, useState } from "react";

import LoginButton from "./LoginButton";

import { useTranslation } from "react-i18next";

import { MAIN_NETWORK } from "@/app/constants/constant";

import { SignInWithLens, Theme, Size } from "@lens-protocol/widgets-react";

export default function RegisterButton() {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const [api, contextHolder_notification] = notification.useNotification();

  const { execute: create, error: createError, isPending } = useCreateProfile();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenlens, setIsModalOpenlens] = useState(false);

  const [registerStatus, setRegisterStatus] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancellens = () => {
    setIsModalOpenlens(false);
  };

  async function onError(error) {
    if (error) {
      setIsModalOpenlens(true);
    }
  }

  async function onSignIn(tokens, profile) {
    if (!profile) {
      setIsModalOpenlens(true);
    }
  }

  if (registerStatus) {
    return <LoginButton />;
  }

  const onFinish = async (values: any) => {
    let handle = values.handle;
    if (!handle) return;

    messageApi.open({
      type: "loading",
      content: t("registerLoading"),
      duration: 0,
    });

    const res = create({
      handle: handle,
    });

    res.then((er) => {
      if (er.isFailure()) {
        let mes = er.error.message;
        api.error({
          message: "error",
          description: mes,
        });
        messageApi.destroy();
      } else {
        api.success({
          message: "success",
          description: t("regSuccess"),
          icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        });
        handleOk();
        messageApi.destroy();
        setRegisterStatus(true);
      }
    });
  };

  return (
    <>
      <>
        {contextHolder}
        {contextHolder_notification}

        <Modal
          title="claim"
          open={isModalOpenlens}
          onCancel={handleCancellens}
          footer={[]}
        >
          <div className="text-base">
            访问{" "}
            <a
              target="_blank"
              className="text-indigo-500"
              rel="noreferrer"
              href="https://claim.lens.xyz/"
            >
              镜头索取站点
            </a>{" "}
            申领您的句柄，然后回到这里。
          </div>
        </Modal>

        <Modal
          title="register"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[]}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="handle"
              name="handle"
              rules={[{ required: true, message: "Please input your handle!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
      {MAIN_NETWORK ? (
        <SignInWithLens onError={onError} onSignIn={onSignIn} />
      ) : (
        <Button onClick={showModal} loading={isPending}>
          {t("register")}
        </Button>
      )}
    </>
  );
}
