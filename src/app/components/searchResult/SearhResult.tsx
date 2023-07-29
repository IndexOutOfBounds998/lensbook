import React, { useState } from "react";
import type { TabsProps } from "antd";
import { useTranslation } from "react-i18next";
import { Tabs } from "antd";
import "../../style/SearchResult.css";
import UserList from "./userList/UserList";
import PostList from "./postList/PostList";
import user from "../../../assets/user.jpg";

// import Macy from 'macy';
// @ts-ignore
interface SearchResultProps {
  inputValue: any;
}

const SearchResult: React.FC<SearchResultProps> = ({ inputValue }) => {
  const { t } = useTranslation();

  let [cardSize, setCardSize, cardSizeRef] = useState(4);

  let [cardWidth, setCardWidth, cardWidthRef] = useState(0);

  const postList = [
    {
      imgUrl: user,
      name: "userName",
      like: "3.4k",
      text: "cool",
    },
    {
      imgUrl: user,
      name: "userName2",
      like: "3.4k",
      text: "Nothing Here",
    },
    {
      imgUrl: user,
      name: "userName3",
      like: "3.4k",
      text: "Hello World",
    },
    {
      imgUrl: user,
      name: "userName4",
      like: "3.4k",
      text: "ME TOO",
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("user"),
      children: <UserList inputValue={inputValue} />, //用户列表
    },
    {
      key: "2",
      label: t("post"),
      children: <PostList inputValue={inputValue} />, //帖子列表
    },
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div className="w-full">
      <div>
        <Tabs
          defaultActiveKey="1"
          centered={true}
          size="large"
          items={items}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default SearchResult;
