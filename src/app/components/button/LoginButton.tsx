import { useWalletLogin, useActiveProfile } from '@lens-protocol/react-web';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from 'antd';
import { useTranslation } from "react-i18next";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import {
  polygon,
  polygonMumbai
} from 'wagmi/chains';
import { useEffect } from 'react';
import ProfileSetting from '@/app/components/ProfileSetting';
import { getWalletClient } from '@wagmi/core';
import { MAIN_NETWORK } from '@/app/constants/constant';
export default function LoginButton() {
  const { chain } = useNetwork()

  const { switchNetwork } = useSwitchNetwork();

  const { t } = useTranslation();

  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

  const { address, isConnected } = useAccount();

  const { disconnectAsync } = useDisconnect();

  const { connectAsync, connectors, isLoading, pendingConnector } = useConnect();

  const { data: profile, error, loading: profileLoading } = useActiveProfile();


  useEffect(() => {

    if (chain && switchNetwork) {
      const targetNetworkId = MAIN_NETWORK ? polygon.id : polygonMumbai.id;
      if (chain.id !== targetNetworkId) {
        switchNetwork(targetNetworkId);
      }
    }


  }, [chain, switchNetwork])

  if (profile) {
    return <ProfileSetting></ProfileSetting>
  }

  const onLoginClick = async () => {

    const walletClient = await getWalletClient();

    await login({
      address: walletClient.account.address,
    });
  };

  return (
    <>
      {profile ? <ProfileSetting></ProfileSetting> : !isConnected ? <ConnectButton /> :

        <Button loading={isLoginPending} disabled={isLoginPending} onClick={onLoginClick}>{t('login')}</Button>
      }
    </>
  );
}
