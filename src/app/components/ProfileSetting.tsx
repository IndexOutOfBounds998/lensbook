import { useTranslation } from "react-i18next";
import { useWalletLogout, useActiveProfile } from '@lens-protocol/react-web';
import { formatNickName, formatPicture } from "@/app/utils/utils";
import { Skeleton, Popover } from 'antd';
import { useNetwork } from 'wagmi'
import {
    polygonMumbai
} from 'wagmi/chains';
import { useEffect } from "react";
import { useAccount, useDisconnect } from 'wagmi';
export default function ProfileSetting() {
    const { execute: logout, isPending } = useWalletLogout();

    const { data: profile, error, loading } = useActiveProfile();

    const { chain, chains } = useNetwork()

    const { address, isConnected } = useAccount();

    const { disconnectAsync } = useDisconnect();

    useEffect(() => {
        if (chain) {
            if (chain.id !== polygonMumbai.id) {
                logout()
                // if (isConnected) {
                //     disconnectAsync();
                // }
            }
        }

    }, [chain, logout])

    const { t } = useTranslation();

    const list = [
        { value: profile && profile.stats.totalFollowing, title: t('follow') },
        { value: profile && profile.stats.totalFollowers, title: t('fans') },
        { value: profile && profile.stats.totalPosts, title: t('post') },
        { value: profile && profile.stats.totalCollects, title: t('collect') },
    ]

    const exit = () => {
        logout()
    }

    const tools = [
        { icon: 'setting-fill', title: t('settings'), router: '/Settings' },
        { icon: 'time-circle-fill', title: t('history'), router: '' },
        { icon: 'tuichu-x', title: t('exit'), router: '', click: exit },
    ]

    const content = () => {
        return
        <>
            <div className='p-[15px] w-[300px]'>
                <Skeleton loading={loading} avatar paragraph={{ rows: 4 }}>
                    <div className='flex items-center mb-[20px]'>
                        <img className='w-[50px] h-[50px] cursor-pointer rounded-3xl mr-[15px]' src={profile && formatPicture(profile.picture)} />
                        <div className='leading-7'>
                            <div className='hover:text-[#3339] cursor-pointer'>
                                <span className='text-[20px] font-bold'>{profile && formatNickName(profile.handle)}</span>
                                <i className='iconfont icon-icon-right text-[10px]' />
                            </div>
                            <p className='truncate w-[200px] text-[#3339] cursor-pointer hover:text-[#000]'>{profile && profile.bio}</p>
                        </div>
                    </div>
                    <div className='flex justify-around mb-[30px]'>
                        {
                            list.map((item, index) => (
                                <div key={index} className='text-[#3339] text-center cursor-pointer hover:text-[blueviolet]'>
                                    <p className='text-black'>{item.value}</p> {item.title}
                                </div>
                            ))
                        }
                    </div>
                    <div className='flex justify-between'>
                        {
                            tools.map((item, index) => (
                                <div
                                    key={index}
                                    className='mr-[16px] text-[#333] text-center cursor-pointer hover:text-[blueviolet]' onClick={item.click}
                                >
                                    <i className={`iconfont icon-${item.icon} text-[25px]`} />
                                    <p>{item.title}</p>
                                </div>
                            ))
                        }
                    </div>
                </Skeleton>
            </div>
        </>
    }

    return (
        <>
            <Popover content={content} title="">
                <div className='ml-[20px] flex cursor-pointer items-center'>
                    <div className='w-[32px] rounded-3xl overflow-hidden'>
                        <img className='w-full' src={profile && formatPicture(profile.picture)} />
                    </div>
                    <i className='iconfont icon-icon-down text-[20px] mr-3' />
                </div>
            </Popover>
        </>


    )
}

