import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NextImage from "next/image";
import { Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAuthenticatedClient } from "@/app/shared/getAuthenticatedClient";
import { formatTextLenth20 } from "@/app/utils/utils";
// import Macy from 'macy';
// @ts-expect-error
interface PostListProps {
  inputValue: any;
}

const PostList: React.FC<PostListProps> = ({ inputValue }) => {
  const { t } = useTranslation();

  let [resultObj, setResultObj] = useState({});
  //列表数据
  let [dataList, setDataList] = useState([]);

  useEffect(() => {
    searchPosts();
  }, [inputValue]);

  //查询
  const searchPosts = async () => {
    if (inputValue) {
      console.log(inputValue);
      const lensClient = await getAuthenticatedClient();
      const result = await lensClient.search.publications({
        query: inputValue,
        limit: 10,
        sources: [
          "lenster",
          "lenstrip",
          "lenstube",
          "orb",
          "buttrfly",
          "lensplay",
        ],
      });
      setDataList(result.items);
      setResultObj(result);
      console.log(result);
    }
  };

  const loadMore = async () => {
    const result = await resultObj.next();
    setDataList(dataList.concat(result.items));
    setResultObj(result);
    console.log(result);
  };

  return (
    <div id="post-list" className="w-full h-[300px] overflow-auto">
      <InfiniteScroll
        dataLength={dataList.length}
        next={loadMore}
        hasMore={resultObj.hasMore}
        loader={
          <div className="w-full flex items-center justify-center h-[25px] mb-[10px]">
            <Spin tip="Loading" size="middle" />
          </div>
        }
        scrollableTarget="post-list"
      >
        {dataList.map((item, index) => (
          <div
            key={index}
            className="px-[15px] py-[5px] hover:bg-[#8a2be236] cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div className="w-[calc(100%-80px)]">
                <p className="w-full ml-[5px] text-[16px] truncate">
                  {item.metadata.title || item.metadata.content}
                </p>
              </div>
              <div className="flex items-stretch">
                <i className="iconfont icon-heart text-[16px] mr-[3px]" />
                <span>{item.stats.totalUpvotes}</span>
              </div>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
