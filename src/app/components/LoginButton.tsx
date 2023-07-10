import { useWalletLogin } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from 'antd';
import { useTranslation } from "react-i18next";

export default function LoginButton() {
  const { t } = useTranslation();

  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

  const { isConnected } = useAccount();

  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
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
    </div>
  );
}