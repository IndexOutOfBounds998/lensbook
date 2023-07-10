// app/page.tsx
'use client'
import { useExploreProfiles } from '@lens-protocol/react-web'
import Link from 'next/link'
import { formatPicture } from './utils'
import React, {useState} from "react";
import LayoutHeader from './utils/layout/Header'
import LayoutSider from './utils/layout/Sider'
import Content from './utils/Home/Content'
import NoteDetail from "./utils/Home/NoteDetail";

export default function Home() {
  let [card, setCard] =  useState('');
  let [img, setImg] =  useState('');
  let [cardData, setCardData] =  useState('');
  let [showDetail, setShowDetail] =  useState(false);
  let [showRegister, setShowRegister] =  useState(false);
  let [searchValue, setSearchValue] =  useState('');

  const cardClick = (card, img, item) => {
    setCard(card);
    setImg(img);
    setCardData(item);
    setShowDetail(true);
  }

  const registerClick = () => {
    setShowRegister(true);
  }

  return (
    <div className='min-w-[1280px] h-full'>
      <LayoutHeader setSearchValue={setSearchValue}/>
      <div className='flex flex-row pt-20 h-full'>
        <LayoutSider registerClick={registerClick}/>
        <Content cardClick={cardClick}/>
      </div>
      {
        showDetail ? <NoteDetail card={card} img={img} item={cardData} setShowDetail={setShowDetail}/> : ''
      }
    </div>
  )
}