import React from "react";
import { useTranslation } from "react-i18next";
import logo from '../../../assets/logo192.png'
import ProfileSetting from "@/app/components/ProfileSetting";
import LoginButton from "@/app/components/button/LoginButton";
import Search from "./Search";
import { useActiveProfile } from '@lens-protocol/react-web';
import { useActiveWallet } from '@lens-protocol/react-web';
import RegisterButton from "@/app/components/button/RegisterButton";
export default function Header({ }) {

    const { data: wallet, loading } = useActiveWallet();
    const { data: profile, error, loading: profileLoading } = useActiveProfile();

    const titleList = [
        { text: '业务合作', src: '' },
        { text: '创作者服务', src: '' },
        { text: '关于我们', src: '' },
    ];
    const { t } = useTranslation();


    // if(error){
    //     return  <LoginButton />;
    // }

    return (
        <header className='w-full px-10 fixed bg-white top-0 min-w-[1250px] z-50'>
            <div className='items-center flex justify-between'>
                <div className='w-20'>
                    <img className='w-20 h-16' src={logo} alt="" />
                </div>
                <div className='w-[30%] h-10 fixed left-1/2 translate-x-[-50%]'>
                    <Search />
                </div>
                <div className='flex items-center'>
                    {titleList.map((item, index) => (
                        <span className='text-[16px] m-4 text-zinc-500 cursor-pointer' key={index}>
                            <a href={item.src}>{item.text}</a>
                        </span>
                    ))}
                    {wallet ?
                        profile ? <ProfileSetting /> : <RegisterButton /> : <LoginButton />
                    }
                </div>
            </div>

        </header>
    )
}
