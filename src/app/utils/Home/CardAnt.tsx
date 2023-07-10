import React, { useEffect, useRef, useState } from "react";
import { formatAvater, formatPicture, formatNickName } from "../../util/FormatContent"
import errorImg from '../../../assets/error.png'
import {Card, message, Skeleton} from 'antd';
import user from '../../../assets/user.jpg'
import './style/Card.css'
import {useMutation} from "@apollo/client";
import API from "../../api/api";
import {AUTHORIZE_PREFIX} from "../../constants/constant";
import {useTranslation} from "react-i18next";

export default function CardAnt({ item, index, cardClick, width, position, cardPosition }) {
    const card = useRef();
    const imgRef = useRef();
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    let [contentImg, setContentImg] = useState(errorImg);
    let [contentItem, setContentItem] = useState({});
    let [imgInfo, setImgInfo] = useState();
    let [imgLoad, setImgLoad] = useState(true);
    let [avatarImg, setAvatarImg] = useState();
    let [favouriteStatus, setFavouriteStatus] = useState();

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
                    cardPosition({width: 194, height: 195}, index);
                }
            }
            avatarLoad();
        }
    }, []);

    const avatarLoad = async () => {
        const url = formatPicture(item.profile.coverPicture);
        let imgObj = new Image();
        imgObj.src = url;
        imgObj.onload = () => {
            setAvatarImg(url);
        }
        imgObj.onerror = () => {
            setAvatarImg(user);
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

    //点赞
    const likeClick = async (e) => {
        e.stopPropagation();
        if (isLogin) {
            if (!favouriteStatus) {
                //点赞

            } else {
                //取消点赞

            }
        }
    }

    return (
        <Card
            ref={card}
            hoverable
            style={{
                width: width,
            }}
            cover={
                <>
                    <img
                        ref={imgRef}
                        className='w-full'
                        alt="example"
                        src={contentImg}
                        style={{display: imgLoad ? 'none' : 'block'}}
                    />
                    {imgLoad ? <Skeleton.Image className='w-full' active={true}/> : ''}
                </>
            }
            onClick={() => {
                cardClick(card, imgInfo, item)
            }}
        >
            <div className='p-2.5'>
                <p className='text-[14px] leading-5 line-clamp-2 tracking-wide mb-2 cursor-pointer'>
                    {contentItem.content}
                </p>
                <div className='h-[20px] text-[13px] flex justify-between text-gray-500 cursor-pointer'>
                    <div className='flex flex-row items-center'>
                        <div
                            className='w-[20px] h-[20px] rounded-2xl mr-[6px] bg-cover'
                            style={{
                                backgroundImage: `url(${avatarImg})`,
                            }}
                        />
                        <span>{formatNickName(item.profile.name)}</span>
                    </div>
                    <div className='cursor-pointer leading-[2px] text-[14px] flex flex-row items-center'>
                        <i
                            className={`iconfont icon-${favouriteStatus ? 'heart-fill text-[#ff2442]' : 'heart'} mr-[5px]`}
                            onClick={likeClick}
                        />
                        <span>{contentItem.favouriteCount}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
