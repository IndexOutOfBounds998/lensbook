// app/layout.tsx
"use client";
import "./globals.css";
import { LensProvider, LensConfig, production, appId, development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import "@/app/react-i18next/i18n";
import LayoutHeader from "./pages/layout/Header";
import React from "react";
import { ALCHEMY_KEY, RB_PID } from "@/app/constants/constant"

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  polygonMumbai,
  polygon
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { MAIN_NETWORK } from "@/app/constants/constant";
const { chains, publicClient } = configureChains(
  [MAIN_NETWORK ? polygon : polygonMumbai],
  [
    alchemyProvider({ apiKey: ALCHEMY_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'lenstrip',
  projectId: RB_PID,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: MAIN_NETWORK ? production : development,
  sources: [appId('lenster'), appId('lenstrip')],
  appId: appId('lenstrip')
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <head>
      <script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"/>
    </head>
    <body>
    <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} coolMode={true}>
          <LensProvider config={lensConfig}>
              <div className='min-w-[1280px] h-full'>
                <LayoutHeader />
                <div className='flex flex-row pt-20 h-full'>
                  {children}
                </div>
              </div>
          </LensProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </body>
    </html>
  );
}
