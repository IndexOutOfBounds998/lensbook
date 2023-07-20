import React, { useState } from 'react';
import {
  ProfileOwnedByMe,
  useActiveProfile,
  useActiveWallet,
  WalletData,
} from '@lens-protocol/react-web';
import {  message } from 'antd';
import { useTranslation } from "react-i18next";
import { ReactNode } from 'react';

type LoggedInConfig = {
  wallet: WalletData;
  profile: ProfileOwnedByMe;
};

export type WhenLoggedInWithProfileProps = {
  children: (config: LoggedInConfig) => ReactNode;
};

export function WhenLoggedInWithProfile({ children }: WhenLoggedInWithProfileProps) {
  const { data: wallet, loading: walletLoading } = useActiveWallet();
  const { data: profile, error, loading: profileLoading } = useActiveProfile();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const handleLoginAlert = () => {
    messageApi.open({
      type: 'error',
      content: t('needLogin'),
    });
  };

  if (walletLoading || profileLoading) {
    return null;
  }

  if (wallet === null || profile === null || error) {
    return (
      <>
        {contextHolder}
        <div onClick={handleLoginAlert}>{children({ wallet: null, profile: null })}</div>
      </>
    );
  }

  return <>{children({ wallet, profile })}</>;
}
