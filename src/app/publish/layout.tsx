"use client";

import LayoutSider from "../../pages/layout/Sider";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
          <LayoutSider/>
          <div className='w-full bg-[#eef1f8]'>
              <div className="w-full py-[30px] pl-[30px] h-full">
                  {children}
              </div>
          </div>
      </>
  );
}
