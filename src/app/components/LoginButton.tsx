import { useWalletLogin } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button, Modal } from 'antd';
import { useTranslation } from "react-i18next";
import { useState } from 'react';
export default function LoginButton() {
  const { t } = useTranslation();

  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

  const { isConnected } = useAccount();

  const { disconnectAsync } = useDisconnect();

  const { connect, connectAsync, connectors, error, isLoading, pendingConnector } = useConnect()

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onLoginClick = async () => {


    if (pendingConnector == undefined) {
       showModal();
       return;
    }

    if (isConnected) {
      await disconnectAsync();
    }
    const { connector } = await connectAsync();
    if (connector) {
      const walletClient = await connector.getWalletClient();
      await login({
        address: walletClient.account.address,
      });
    }

  };

  



  return (
    <div>
      {loginError && <p>{loginError}</p>}
      <Button loading={isLoginPending} disabled={isLoginPending} onClick={onLoginClick}>{t('login')}</Button>

      <Modal title="switch" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <div>
            {connectors.map((connector) => (
              <button
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </button>
            ))}
  
            {error && <div>{error.message}</div>}
          </div>
        </Modal>
    </div>
  );
}