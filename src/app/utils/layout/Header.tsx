import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover } from "antd";
import logo from '../../../assets/logo192.png'
import ProfileSetting from "@/app/components/ProfileSetting";
import LoginButton from "@/app/components/LoginButton";
import Search from "./Search";

import { useActiveWallet } from '@lens-protocol/react-web';


export default function Header({ setSearchValue }) {

    const { data: wallet, loading } = useActiveWallet();


    const titleList = [
        { text: '业务合作', src: '' },
        { text: '创作者服务', src: '' },
        { text: '关于我们', src: '' },
    ];
    const { t } = useTranslation();
      
    return (
        <header className='w-full px-10 fixed bg-white top-0 min-w-[1250px] z-50'>
            <div className='items-center flex justify-between'>
                <div className='w-20'>
                    <img className='w-20 h-16' src={logo} alt="" />
                </div>
                <div className='w-[30%] h-10 fixed left-1/2 translate-x-[-50%]'>
                    <Search setSearchValue={setSearchValue} />
                </div>
                <div className='flex items-center'>
                    {titleList.map((item, index) => (
                        <span className='text-[16px] m-4 text-zinc-500 cursor-pointer' key={index}>
                            <a href={item.src}>{item.text}</a>
                        </span>
                    ))}
                    {wallet ?
                        <Popover content={ProfileSetting} title="">
                            <div className='ml-[20px] flex cursor-pointer items-center'>
                                <div className='w-[32px] rounded-3xl overflow-hidden'>
                                    <img className='w-full' src={require('../../../assets/user.jpg')} />
                                </div>
                                <i className='iconfont icon-icon-down text-[20px] mr-3' />
                            </div>
                        </Popover> : <LoginButton></LoginButton>
                    }
                </div>
            </div>

        </header>
    )
}
