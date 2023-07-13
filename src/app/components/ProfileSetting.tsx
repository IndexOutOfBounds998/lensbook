import { useTranslation } from "react-i18next";
import { useWalletLogout, useActiveProfile } from '@lens-protocol/react-web';
import { formatNickName, formatPicture } from "@/app/util/utils";
import { Skeleton } from 'antd';
import { useNetwork } from 'wagmi'
import {
    polygonMumbai
} from 'wagmi/chains';
import { useEffect } from "react";

export default function ProfileSetting() {
    const { execute: logout, isPending } = useWalletLogout();

    const { data, error, loading } = useActiveProfile();

    const { chain, chains } = useNetwork()

    useEffect(() => {
        if (chain) {
            if (chain.id !== polygonMumbai.id) {
                logout()
            }
        }

    }, [chain, logout])

    const { t } = useTranslation();

    const list = [
        { value: data && data.stats.totalFollowing, title: t('follow') },
        { value: data && data.stats.totalFollowers, title: t('fans') },
        { value: data && data.stats.totalPosts, title: t('post') },
        { value: data && data.stats.totalCollects, title: t('collect') },
    ]

    const exit = () => {
        logout()
    }

    const tools = [
        { icon: 'setting-fill', title: t('settings'), router: '/Settings' },
        { icon: 'time-circle-fill', title: t('history'), router: '' },
        { icon: 'tuichu-x', title: t('exit'), router: '', click: exit },
    ]

    return (


        <div className='p-[15px] w-[300px]'>
            <Skeleton loading={loading} avatar paragraph={{ rows: 4 }}>
                <div className='flex items-center mb-[20px]'>
                    <img className='w-[50px] h-[50px] cursor-pointer rounded-3xl mr-[15px]' src={data && formatPicture(data.picture)} />
                    <div className='leading-7'>
                        <div className='hover:text-[#3339] cursor-pointer'>
                            <span className='text-[20px] font-bold'>{data && formatNickName(data.handle)}</span>
                            <i className='iconfont icon-icon-right text-[20px]' />
                        </div>
                        <p className='truncate w-[200px] text-[#3339] cursor-pointer hover:text-[#000]'>{data && data.bio}</p>
                    </div>
                </div>
                <div className='flex justify-around mb-[30px]'>
                    {
                        list.map((item) => (
                            <div className='text-[#3339] text-center cursor-pointer hover:text-[blueviolet]'>
                                <p className='text-black'>{item.value}</p> {item.title}
                            </div>
                        ))
                    }
                </div>
                <div className='flex justify-between'>
                    {
                        tools.map((item) => (
                            <div
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


    )
}

