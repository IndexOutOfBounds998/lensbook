// app/page.tsx
"use client";
import { useExploreProfiles } from "@lens-protocol/react-web";
import Link from "next/link";
import { formatPicture } from "./utils/utils";
import React, { useEffect, useState } from "react";
import LayoutHeader from "./pages/layout/Header";
import LayoutSider from "./pages/layout/Sider";
import Content from "./pages/Home/Content";
import NoteDetail from "./components/NoteDetail";

export default function Home() {
  let [card, setCard] = useState("");
  let [img, setImg] = useState("");
  let [cardData, setCardData] = useState("");
  let [showDetail, setShowDetail] = useState(false);
  let [showRegister, setShowRegister] = useState(false);
  let [searchValue, setSearchValue] = useState("");

  const cardClick = (card: string, img: string, item: string) => {
    setCard(card);
    setImg(img);
    setCardData(item);
    setShowDetail(true);
  };

  const registerClick = () => {
    setShowRegister(true);
  };

  return (
    <>
      <LayoutSider
        registerClick={registerClick}
        titleList={undefined}
        styleWidth={undefined}
      />
      <Content cardClick={cardClick} />
      {showDetail ? (
        <NoteDetail
          card={card}
          img={img}
          item={cardData}
          setShowDetail={setShowDetail}
        />
      ) : (
        ""
      )}
    </>
  );
}
