
import React, { useRef, useEffect, useState } from 'react'
import {useTranslation} from "react-i18next";
import NextImage from 'next/image'
import {Spin} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAuthenticatedClient } from "@/app/shared/getAuthenticatedClient";
import { formatPicture, formatNickName } from "../../../utils/FormatContent"

// import Macy from 'macy';
// @ts-ignore
interface UserListProps {
    inputValue: any;
}

const UserList: React.FC<UserListProps> = ({ inputValue }) => {

    const { t } = useTranslation();

    let [resultObj, setResultObj] = useState({});
    //列表数据
    let [dataList, setDataList] = useState([]);

    useEffect(() => {
        searchProfiles()
    }, [inputValue]);

    //查询
    const searchProfiles = async () => {
        if (inputValue) {
            console.log(inputValue)
            const lensClient = await getAuthenticatedClient();
            const result = await lensClient.search.profiles({
                query: inputValue,
                limit: 10,
            });
            setDataList(result.items)
            setResultObj(result);
            console.log(result)
        }
    }

    //加载更多
    const loadMore = async () => {
        const result = await resultObj.next();
        setDataList(dataList.concat(result.items))
        setResultObj(result);
        console.log(result)
    }

    return (
        <div id='user-list' className='w-full h-[300px] overflow-auto'>
            <InfiniteScroll
                dataLength={dataList.length}
                next={loadMore}
                hasMore={true}
                loader={
                    <div
                        className='w-full flex items-center justify-center h-[25px] mb-[10px]'
                    >
                        <Spin tip="Loading" size="middle" />
                    </div>
                }
                scrollableTarget='user-list'
            >
                {
                    dataList.map((item, index) => (
                        <div key={index} className='px-[15px] py-[5px] hover:bg-[#8a2be236] cursor-pointer'>
                            <div className='flex justify-between'>
                                <div className='flex items-center'>
                                    <NextImage
                                        className='rounded-xl'
                                        alt="example"
                                        loading='lazy'
                                        src={ item.picture ? formatPicture(item.picture) : '' }
                                        width={25}
                                        height={25}
                                        style={{height: '25px'}}
                                    />
                                    <span className='ml-[5px] text-[16px]'>{ formatNickName(item.name || item.handle) }</span>
                                </div>
                                <div>
                                    <i className='iconfont icon-icon-user text-[14px]' />
                                    <span>{ item.stats.totalFollowing }</span>
                                </div>
                            </div>
                            <p className='text-[14px] text-[#92959d] truncate'>{ item.bio }</p>
                        </div>
                    ))
                }
            </InfiniteScroll>
        </div>
    )
};

export default UserList;
