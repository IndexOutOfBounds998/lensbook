
import React, { useRef, useEffect, useState } from 'react'
import {useTranslation} from "react-i18next";
import NextImage from 'next/image'
import {Spin} from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

// import Macy from 'macy';
// @ts-ignore
interface PostListProps {
    inputValue: any;
}

const PostList: React.FC<PostListProps> = ({ inputValue }) => {

    const { t } = useTranslation();

    let [resultObj, setResultObj] = useState({});
    //列表数据
    let [dataList, setDataList] = useState([]);

    //加载更多
    const loadMore = () => {
        setDataList(dataList.concat(dataList))
    }

    return (
        <div id='post-list' className='w-full h-[300px] overflow-auto'>
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
                scrollableTarget='post-list'
            >
            {
                dataList.map(item => (
                    <div className='px-[15px] py-[5px] hover:bg-[#8a2be236] cursor-pointer'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <span className='ml-[5px] text-[16px]'>{ item.text }</span>
                            </div>
                            <div className='flex items-stretch'>
                                <i className='iconfont icon-heart text-[16px] mr-[3px]' />
                                <span>{ item.like }</span>
                            </div>
                        </div>
                    </div>
                ))
            }
            </InfiniteScroll>
        </div>
    )
};

export default PostList;
