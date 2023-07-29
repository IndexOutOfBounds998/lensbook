import React, { useEffect, useRef, useState } from "react";
import { formatPicture, formatNickName } from "../utils/FormatContent"
import { Button, Card, message, Skeleton } from 'antd';
import '../style/Card.css'
import { useTranslation } from "react-i18next";
import NextImage from 'next/image'
import Link from "next/link";
// @ts-ignore
export default function CardAnt({ item, index, cardClick, width, position, cardPosition }: {
    item: any,
    index: number,
    width: number,
    position: string,
    cardPosition: (img: { height: number, width: number }, index: number) => void
}) {

    const card = useRef();
    const imgRef = useRef();
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    let [contentImg, setContentImg] = useState('/cover.png');
    let [contentItem, setContentItem] = useState({
        content: undefined,
        favouriteCount: undefined
    });
    let [imgInfo, setImgInfo] = useState(new Image());
    let [imgLoad, setImgLoad] = useState(true);
    let [avatarImg, setAvatarImg] = useState('');
    let [favouriteStatus, setFavouriteStatus] = useState(false);

    const convertImage = (w, h) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;

    const toBase64 = (str) =>
        typeof window === 'undefined'
            ? Buffer.from(str).toString('base64')
            : window.btoa(str);

    useEffect(() => {
        if (item.metadata) {
            setContentItem(item.metadata)
            setFavouriteStatus(false)
            let imageUrl;
            // if (item.metadata.mainContentFocus === 'VIDEO') imageUrl = item.metadata.image;
            imageUrl = formatPicture(item.metadata.media[0])
            if (imageUrl) {
                setContentImg(imageUrl);
                setImgLoad(false);
            }
            avatarLoad();
        }
    }, [item]);

    const avatarLoad = async () => {
        const url = formatPicture(item.profile.picture);
        setAvatarImg(url);
    }

    return (
        <Card
            ref={card}
            hoverable
            className='mb-[20px]'
            style={{
                width: width,
            }}
            cover={
                <>
                    <NextImage
                        ref={imgRef}
                        className='w-full'
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            convertImage(700, 475)
                        )}`}
                        alt="example"
                        loading='lazy'
                        width={width}
                        height={300}
                        src={contentImg && contentImg}
                        loader={({ src, width: w, quality }) => {
                            const q = quality || 75;
                            return `/api/custom-loader?url=${encodeURIComponent(
                                src
                            )}?w=${w}&q=${q}`;
                        }}
                        onLoadingComplete={(img) => {
                            setImgInfo(img);
                            setImgLoad(false);
                            cardPosition(img, index)
                        }}
                        style={{ display: imgLoad ? 'none' : 'block' }}
                    />
                    {
                        item.__typename === 'Mirror' ? item.mirrorOf.metadata.mainContentFocus === 'VIDEO' : item.metadata.mainContentFocus === 'VIDEO' ? <i className='iconfont icon-bofang cursor-pointer text-[40px] opacity-70
                     text-[#fff] mr-3 operator mix-blend-difference absolute top-[calc(50%-20px)] left-[calc(50%-20px)]' /> : ''
                    }
                    {imgLoad ? <Skeleton.Image className='w-full' active={true} /> : ''}
                </>
            }
            onClick={() => {
                cardClick(card, imgInfo, item)
            }}
        >
            <div className='p-2.5'>
                <p className='text-[14px] leading-5 line-clamp-2 tracking-wide mb-2 cursor-pointer'>
                    { contentItem?.content ? contentItem.content : ''}
                </p>
                <div className='h-[20px] text-[13px] flex justify-between text-gray-500 cursor-pointer'>
                    <div className='flex flex-row items-center'>
                        <Link href={`/profile/${item.profile.handle}`}>
                            <div
                                className='w-[20px] h-[20px] rounded-2xl mr-[6px] bg-cover'
                                style={{
                                    backgroundImage: `url(${avatarImg})`,
                                }}
                            />
                        </Link>

                        <span>{formatNickName(item.profile.name ? item.profile.name : item.profile.handle)}</span>
                    </div>
                    <div className='cursor-pointer leading-[2px] text-[14px] flex flex-row items-center'>
                        <i
                            className={`iconfont icon-${favouriteStatus ? 'heart-fill text-[#ff2442]' : 'heart'} mr-[5px]`}

                        />
                        <span>{contentItem.favouriteCount}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
