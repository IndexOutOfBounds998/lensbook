import { useActiveWallet, useCreateProfile } from '@lens-protocol/react-web';

import { SmileOutlined } from '@ant-design/icons';

import { Button, Modal, Form, Input, message, notification, Popover } from 'antd';

import { useEffect, useState } from 'react';

import LoginButton from './LoginButton';
 
import { useTranslation } from "react-i18next";
export default function RegisterButton() {
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();

    const [api, contextHolder_notification] = notification.useNotification();

    const { execute: create, error: createError, isPending } = useCreateProfile();

    const [isModalOpen, setIsModalOpen] = useState(false);

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


    if (registerStatus) {
        return <LoginButton></LoginButton>
    }

    const onFinish = async (values: any) => {
        let handle = values.handle;
        if (!handle) return;

        messageApi.open({
            type: 'loading',
            content: t('registerLoading'),
            duration: 0,
        });


        const res = create({
            handle: handle
        });

        res.then((er) => {
            if (er.isFailure()) {
                let mes = er.error.message;
                api.error({
                    message: 'error',
                    description: mes,

                });
                messageApi.destroy();
            } else {
                api.success({
                    message: 'success',
                    description: t('regSuccess'),
                    icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                });
                handleOk();
                messageApi.destroy();
                setRegisterStatus(true);
            }
        })




    };

    return (
        <><>
            {contextHolder}
            {contextHolder_notification}
            <Modal title="register" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                        rules={[{ required: true, message: 'Please input your handle!' }]}
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
            <Button onClick={showModal} loading={isPending}>
                {t('register')}
            </Button>
        </>
    );
}
