import { useWalletLogin, useActiveProfile } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from 'antd';
import { useTranslation } from "react-i18next";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import {
  polygonMumbai
} from 'wagmi/chains';
import { useEffect } from 'react';
import ProfileSetting from './ProfileSetting';

export default function LoginButton() {
  const { chain } = useNetwork()

  const { switchNetwork } = useSwitchNetwork();

  const { t } = useTranslation();

  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

  const { isConnected } = useAccount();

  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const { data: profile, error, loading: profileLoading } = useActiveProfile();

  if (profile) {
    return <ProfileSetting></ProfileSetting>
  }
  useEffect(() => {

    if (chain) {
      if (chain.id !== polygonMumbai.id) {
        if (switchNetwork) {
          switchNetwork(polygonMumbai.id);
        }
      }
    }

  }, [chain, switchNetwork])
  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    const walletClient = await connector.getWalletClient();
    await login({
      address: walletClient.account.address,
    });
  };

  return (
    <div>

      {profile ? <ProfileSetting></ProfileSetting> : !isConnected ? <ConnectButton /> :

        <Button loading={isLoginPending} disabled={isLoginPending} onClick={onLoginClick}>{t('login')}</Button>
      }



    </div>
  );
}
