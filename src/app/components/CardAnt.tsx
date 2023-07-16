import React, { useEffect, useRef, useState } from "react";
import { formatPicture, formatNickName } from "../utils/FormatContent"
import { Card, message, Skeleton } from 'antd';
import '../style/Card.css'
import { AUTHORIZE_PREFIX } from "../constants/constant";
import { useTranslation } from "react-i18next";
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
    let [contentImg, setContentImg] = useState('');
    let [contentItem, setContentItem] = useState({
        content: undefined,
        favouriteCount:undefined
    });
    let [imgInfo, setImgInfo] = useState(new Image());
    let [imgLoad, setImgLoad] = useState(true);
    let [avatarImg, setAvatarImg] = useState('');
    let [favouriteStatus, setFavouriteStatus] = useState(false);

    //点赞
    // const [addLike] = useMutation(API.LIKE({profileId: parseInt(item.profileId), pubId: parseInt(item.pubId)}))
    //取消点赞
    // const [disLike] = useMutation(API.DISLIKE({profileId: parseInt(item.profileId), pubId: parseInt(item.pubId)}))

    useEffect(() => {
        if (item.metadata) {
            setContentItem(item.metadata)
            setFavouriteStatus(false)
            const image = formatPicture(item.metadata.media[0])
            if (image) {
                let img = new Image();
                img.src = image;
                img.onload = () => {
                    setContentImg(img.src);
                    setImgInfo(img);
                    setImgLoad(false);
                    cardPosition(img, index)
                }
                img.onerror = () => {
                    setImgInfo(img);
                    cardPosition({ width: 194, height: 195 }, index);
                }
            }
            avatarLoad();
        }
    }, []);

    const avatarLoad = async () => {
        const url = formatPicture(item.profile.picture);
        let imgObj = new Image();
        imgObj.src = url;
        imgObj.onload = () => {
            setAvatarImg(url);
        }
        imgObj.onerror = () => {
            setAvatarImg('');
        }
    }

    const isLogin = () => {
        const jwt = localStorage.getItem(AUTHORIZE_PREFIX);
        if (jwt) return true;
        else {
            messageApi.open({
                type: 'error',
                content: t('loginError'),
            });
            return false
        }
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
                    <img
                        ref={imgRef}
                        className='w-full'
                        alt="example"
                        src={contentImg && contentImg}
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
