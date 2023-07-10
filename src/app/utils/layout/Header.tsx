import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Popover} from "antd";
import logo from '../../../assets/logo192.png'
import userImg from '../../../assets/user.jpg'
import Search from "./Search";

export default function Header({setSearchValue}) {
    const titleList = [
        { text:'业务合作', src:'' },
        { text:'创作者服务', src:'' },
        { text:'关于我们', src:'' },
    ];
    const { t } = useTranslation();
    let [user, setUser] = useState();

    useEffect(() => {
        let user;
        try {
            user = JSON.parse(localStorage.getItem('userData'));
        } catch (e) {
            user = null;
        }
        setUser(user);
    }, [])

    const content = () => {
        const list = [
            { value: 0, title: t('follow') },
            { value: 0, title: t('fans') },
            { value: 0, title: t('post') },
            { value: 0, title: t('collect') },
        ]

        const exit = () => {
            // localStorage.removeItem("userData");
            // localStorage.removeItem("currentLoginAddress");
            // localStorage.removeItem(AUTHORIZE_PREFIX);
            // window.location.href = window.location.origin + '/Home';
        }

        const tools = [
            { icon: 'setting-fill', title: t('settings'), router: '/Settings' },
            { icon: 'time-circle-fill', title: t('history'), router: '' },
            { icon: 'tuichu-x', title: t('exit'), router: '', click: exit },
        ]
        return (
            <div className='p-[15px] w-[300px]'>
                <div className='flex items-center mb-[20px]'>
                    <img className='w-[50px] h-[50px] cursor-pointer rounded-3xl mr-[15px]' src={require('../../../assets/user.jpg')}/>
                    <div className='leading-7'>
                        <div className='hover:text-[#3339] cursor-pointer'>
                            <span className='text-[20px] font-bold'>XXXX</span>
                            <i className='iconfont icon-icon-right text-[20px]' />
                        </div>
                        <p className='truncate w-[200px] text-[#3339] cursor-pointer hover:text-[#000]'>xxxxxxxxxxxxxxxxxxxxxxxxxx</p>
                    </div>
                </div>
                <div className='flex justify-around mb-[30px]'>
                    {
                        list.map((item) => (
                            <div className='text-[#3339] text-center cursor-pointer hover:text-[blueviolet]'>
                                <p className='text-black'>{ item.value }</p> {item.title}
                            </div>
                        ))
                    }
                </div>
                <div className='flex justify-between'>
                    {
                        tools.map((item) => (
                            <div
                                className='mr-[16px] text-[#333] text-center cursor-pointer hover:text-[blueviolet]'
                            >
                                <i className={`iconfont icon-${item.icon} text-[25px]`}/>
                                <p>{item.title}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
    return (
        <header className='w-full px-10 fixed bg-white top-0 min-w-[1250px] z-50'>
            <div className='items-center flex justify-between'>
                <div className='w-20'>
                    <img className='w-20 h-16' src={logo} alt=""/>
                </div>
                <div className='w-[30%] h-10 fixed left-1/2 translate-x-[-50%]'>
                    <Search setSearchValue={setSearchValue}/>
                </div>
                <div className='flex items-center'>
                    {titleList.map((item, index) => (
                        <span className='text-[16px] m-4 text-zinc-500 cursor-pointer' key={index}>
                        <a href={item.src}>{item.text}</a>
                    </span>
                    ))}
                    { user ?
                        <Popover content={content} title="">
                            <div className='ml-[20px] flex cursor-pointer items-center'>
                                <div className='w-[32px] rounded-3xl overflow-hidden'>
                                    <img className='w-full' src={require('../../../assets/user.jpg')}/>
                                </div>
                                <i className='iconfont icon-icon-down text-[20px] mr-3' />
                            </div>
                        </Popover> : ''
                    }
                </div>
            </div>

        </header>
    )
}
