import React, { useEffect, useRef, useState } from "react";
import { formatPicture, formatNickName } from "../utils/FormatContent"
import { Card, message, Skeleton } from 'antd';
import '../style/Card.css'
import { useTranslation } from "react-i18next";
import NextImage from 'next/image'
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
        favouriteCount:undefined
    });
    let [imgInfo, setImgInfo] = useState(new Image());
    let [imgLoad, setImgLoad] = useState(true);
    let [avatarImg, setAvatarImg] = useState('');
    let [favouriteStatus, setFavouriteStatus] = useState(false);

    useEffect(() => {
        if (item.metadata) {
            setContentItem(item.metadata)
            setFavouriteStatus(false)
            const imageUrl = formatPicture(item.metadata.media[0])
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
                        alt="example"
                        loading='lazy'
                        width={width}
                        height={300}
                        src={contentImg && contentImg}
                        onLoadingComplete={(img) => {
                            setImgInfo(img);
                            setImgLoad(false);
                            cardPosition(img, index)
                        }}
                        style={{ display: imgLoad ? 'none' : 'block' }}
                    />
                    {imgLoad ? <Skeleton.Image className='w-full' active={true} /> : ''}
                </>
            }
            onClick={() => {
                cardClick(card, imgInfo, item)
            }}
        >
            <div className='p-2.5'>
                <p className='text-[14px] leading-5 line-clamp-2 tracking-wide mb-2 cursor-pointer'>
                    {contentItem && contentItem.content}
                </p>
                <div className='h-[20px] text-[13px] flex justify-between text-gray-500 cursor-pointer'>
                    <div className='flex flex-row items-center'>
                        <div
                            className='w-[20px] h-[20px] rounded-2xl mr-[6px] bg-cover'
                            style={{
                                backgroundImage: `url(${avatarImg})`,
                            }}
                        />
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
