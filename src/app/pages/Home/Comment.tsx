import React, { useEffect, useState } from "react";
import {
  formatAvater,
  formatPicture,
  formatDate,
  formatNickName,
} from "../../utils/FormatContent";
const icon = (icon) => (
  <i className={`iconfont icon-${icon} text-[16px] mr-[5px]`} />
);
import { Comment } from "@lens-protocol/react-web";
import { FC } from "react";

interface CommentArgs {
  item: Comment[];
  total: number;
  children?: React.ReactNode;
}
const Comment: React.FC<CommentArgs> = ({ item, total }) => {
  return (
    <div>
      <p className="text-[#666] mb-[20px]">一共 {total.toString()} 条评论</p>
      {item.map((item) => (
        <div key={item.id} className="flex mb-[16px]">
          <div>
            <img
              className="rounded-3xl w-[32px]"
              src={formatPicture(item.profile.picture)}
              alt=""
            />
          </div>
          <div className="ml-[12px] flex flex-col w-full">
            <span className="leading-[18px] text-[#33333399]">
              {item.profile.name
                ? item.profile.name
                : formatNickName(item.profile.handle)}
            </span>
            <div className="text-[#333333] mt-[7px] leading-[22px]">
              {item.metadata.content}
            </div>
            <div className="flex mt-[12px] justify-between text-[13px] text-[#999]">
              <span className="">{formatDate(item.createdAt)}</span>
              <div className="flex text-[14px]">
                <div className="cursor-pointer hover:text-[#333333]">
                  {icon("xihuan1")}
                  <span />
                </div>
                <div className="cursor-pointer ml-[20px] hover:text-[#333333]">
                  {icon("icon-message")}
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
Comment.displayName = "Comment";
export default Comment;
