
import React, { useRef, useEffect, useState } from 'react'
import {useTranslation} from "react-i18next";
import NextImage from 'next/image'
import user from '../../../../assets/user.jpg'

// import Macy from 'macy';
// @ts-ignore
interface UserListProps {
    userList: any;
}

const UserList: React.FC<UserListProps> = ({ userList }) => {

    const { t } = useTranslation();

    userList = [
        {
            imgUrl: user,
            name: 'userName',
            like: '3.4k',
            text: 'cool'
        },
        {
            imgUrl: user,
            name: 'userName2',
            like: '3.4k',
            text: 'Nothing Here'
        },
        {
            imgUrl: user,
            name: 'userName3',
            like: '3.4k',
            text: 'Hello World'
        },
        {
            imgUrl: user,
            name: 'userName4',
            like: '3.4k',
            text: 'ME TOO'
        },
    ]

    let [cardSize, setCardSize, cardSizeRef] = useState(4);

    let [cardWidth, setCardWidth, cardWidthRef] = useState(0);

    return (
        <div className='w-full'>
            <div>
                <div className='flex justify-between'>
                    <div className='flex items-center'>
                        <NextImage
                            className='rounded-xl'
                            alt="example"
                            loading='lazy'
                            src={user}
                            width={25}
                            height={25}
                        />
                        <span className='ml-[5px] text-[16px]'>userName</span>
                    </div>
                    <div>
                        <i className='iconfont icon-icon-user text-[14px]' />
                        <span>3.4k</span>
                    </div>
                </div>
                <p className='text-[16px] text-[#92959d] truncate'>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
            </div>
        </div>
    )
};

export default UserList;
