import user from '../../../assets/user.jpg'
import Comment from "./Comment";
import React, { useEffect, useRef, useState } from "react";
import { message, Button, notification, Spin } from "antd";
import Input from "antd/es/input";
import { AUTHORIZE_PREFIX, IPFS_API_KEY } from '../../constants/constant';
import { upJsonContent } from "../../api/ipfsApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { formatNickName, formatDate } from "../../util/FormatContent";
import { useTranslation } from "react-i18next";
import { formatPicture } from '@/app/util/utils';
import { getAuthenticatedClient } from "@/app/shared/getAuthenticatedClient";
import {
    useComments,
    useActiveProfile,
    useCreateComment,
    ReactionType,
    ContentFocus,
    CollectPolicyType,
    usePublication,
    useActiveWallet
} from '@lens-protocol/react-web';
import { WhenLoggedInWithProfile } from '@/app/components/auth/WhenLoggedInWithProfile';
import FollowButton from '@/app/components/FollowButton';
import CollectButton from '@/app/components/CollectButton';
import ReactionButton from '@/app/components/ReactionButton';
import { useSignTypedData } from 'wagmi';
export default function NoteDetail({ card, img, item, setShowDetail }) {

    const { data: publication, loading: publication_loading } = usePublication({
        publicationId: item.id,
    });

    const [messageApi, contextHolder] = message.useMessage();
    const [notificationApi, contextHolderNotification] = notification.useNotification();

    const { t } = useTranslation();
    const [messageReplyButtonLoading, setMessageReplyButtonLoading] = useState(false);

    let flag = true;
    let [contentDetail, setContentDetail] = useState({});//帖子详情
    //不要放到一个对象里 容易混淆 各自负责各自的职责

    let [isCollectionStatus, setIsCollected] = useState(false);//是否收藏
    let [isFavouriteStatus, setIsFavourite] = useState(false);//是否点赞
    let [favouriteCount, setFavouriteCount] = useState(0);//点赞数
    let [collectionCount, setCollectionCount] = useState(0);//收藏数

    let [show, setShow] = useState(true);
    let [bgSize, setBgSize] = useState(0);
    let [contentSize, setContentSize] = useState(0);
    let [commentPage, setCommentPage] = useState([]);

    const detail = useRef();
    const imgBox = useRef();
    const contentBox = useRef();
    const commentRef = useRef();


    const appendReplyRef = useRef(null);

    const { data: comments, loading: commentsLoading, hasMore, next } = useComments({
        commentsOf: item.id,
        limit: 10,
    });

    const Icon = (item) => (
        <div className='flex items-center' style={{ color: item.color }}>
            <i className={`iconfont icon-${item.icon} cursor-pointer text-[25px] mr-3`} />
            <span className='font-bold'>{item.text}</span>
        </div>
    );

    useEffect(() => {
        if (flag) {
            scaleDown();
        }
    }, []);

    useEffect(() => {
        setCommentPage(comments || [])
    }, [comments]);

    useEffect(() => {
        if (card && flag) {
            flag = false;
            setShow(false)
            setTimeout(() => {
                setContentSize(contentBox.current.offsetWidth)
                scaleUp();
            }, 100)
        }
    }, [card]);

    useEffect(() => {
        console.log(show)
    }, [show])

    const scaleDown = () => {
        if (!img) {
            return
        }
        const detailWidth = window.innerWidth * 0.7;
        const maxWidth = detailWidth * 0.6;
        const imgScale = detail.current.clientHeight / img.height;
        const imgWidth = img.width * imgScale > maxWidth ? maxWidth : img.width * imgScale;
        setBgSize(imgWidth)
        const cardWidth = card.current.offsetWidth;
        const scale = cardWidth / imgWidth;
        const client = card.current.getBoundingClientRect();
        detail.current.style.border = 'none';
        detail.current.style.boxShadow = 'none';
        detail.current.style.transform = `translate(${client.x}px,${client.y - 32}px) scale(${scale})`;
        detail.current.style.transformOrigin = 'left top';
        imgBox.current.style.backgroundPosition = '';
    }

    const scaleUp = () => {
        const detailWidth = (window.innerWidth - window.innerWidth * 0.7) / 2;
        detail.current.style.border = '1px solid #00000014';
        detail.current.style.boxShadow = '0 0 100px rgba(0,0,0,.1)';
        detail.current.style.transition = 'all 0.5s ease';
        detail.current.style.transform = `translate(${detailWidth}px,0) scale(1)`;
        imgBox.current.style.backgroundPosition = '50%';
    }

    //点击收藏
    const clickCollection = () => {

    }
    //点击点赞
    const clickLike = async () => {

    }
    async function upLoad(data) {
        const config = {
            headers: {
                Authorization: `Bearer ${IPFS_API_KEY}`
            }
        };
        const res = await upJsonContent(data, config)
        if (res && res.data) {
            return res.data.IpfsHash;
        }
        return '';
    }

    const { data: profile, error, loading: profileLoading } = useActiveProfile();

    const { signTypedDataAsync, isLoading: typedDataLoading } = useSignTypedData();



    //发布评论
    const sendComment = async () => {
        const contentURI = 'ar://Y3M4T88IXIBYt63FEpeAUQzSreioCli1A7LYabPV6Vk';
        const lensClient = await getAuthenticatedClient();
        lensClient.explore.publications()
        const typedDataResult = await lensClient.publication.createCommentTypedData({
            profileId: profile.id,
            publicationId: publication.id,
            contentURI: contentURI, // or arweave
            collectModule: {
                revertCollectModule: true, // collect disabled
            },
            referenceModule: {
                followerOnlyReferenceModule: false, // anybody can comment or mirror
            },
        });
        // typedDataResult is a Result object
        const data = typedDataResult.unwrap();
        // sign with the wallet
        const signTypedData = await signTypedDataAsync({
            primaryType: 'CommentWithSig',
            domain: (data.typedData.domain),
            message: data.typedData.value,
            types: (data.typedData.types),
            value: (data.typedData.value)
        });
        // broadcast
        const broadcastResult = await lensClient.transaction.broadcast({
            id: data.id,
            signature: signTypedData,
        });

        // broadcastResult is a Result object
        const broadcastResultValue = broadcastResult.unwrap();

        if (broadcastResultValue.__typename=="RelayerResult") {
            console.log(
                `Transaction was successfuly broadcasted with txId ${broadcastResultValue.txId}`
            );
        }

      
        // const typedDataResult =await lensClient.publication.createCommentTypedData({
        //     profileId: profile && profile.id,
        //     publicationId: publication && publication.id,
        //     contentURI,
        //     collectModule: {
        //         revertCollectModule: true, // collect disabled
        //     },
        //     referenceModule: {
        //         followerOnlyReferenceModule: false, // anybody can comment or mirror
        //     },
        // });

        // if (commentRef.current.input.value) {
        //     console.log(commentRef.current.input.value)
        //     let result = await create({
        //         publicationId: item.id,
        //         content: commentRef.current.input.value,
        //         profileId: profile.id,
        //         contentFocus: ContentFocus.TEXT,
        //         locale: 'en',
        //         collect: {
        //             type: CollectPolicyType.NO_COLLECT
        //         },
        //     })
        //     console.log(result)
        // }
    }

    //加载更多评论
    const moreComment = () => {

    }

    const operate = [
        { icon: 'icon-message', text: contentDetail.commentCount || 0, color: '#3c82f6' },
        { icon: isFavouriteStatus ? 'heart-fill' : 'heart', text: favouriteCount, color: '#ff2442', onClick: clickLike },
        { icon: isCollectionStatus ? 'star-fill' : 'star', text: collectionCount, color: '#ec4899', onClick: clickCollection }
    ];


    return (
        <>
            {contextHolder}
            {contextHolderNotification}
            <div
                className='h-full w-full fixed top-0 z-[100]'
                style={{
                    background: show ? '' : 'hsla(0,0%,100%,.98)',
                    transition: 'all 0.5s ease'
                }}
                onClick={() => {
                    setShow(true);
                    scaleDown();
                    setTimeout(() => { setShowDetail(false) }, 500)
                }}
            >
                <div
                    ref={detail}
                    className='h-[calc(100%-64px)] w-[70%] my-[32px] flex rounded-3xl overflow-hidden'
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div
                        className='w-[auto] bg-[#f8f8f8] flex'
                        style={{
                            background: show ? 'rgba(233,245,250,0)' : '',
                            borderRadius: show ? 'none' : '1rem',
                        }}
                    >
                        <div
                            ref={imgBox}
                            className='bg-no-repeat bg-contain h-full'
                            style={{
                                backgroundImage: `url(${img && img.src})`,
                                width: `${bgSize}px`
                            }}
                        >
                        </div>
                    </div>
                    <div
                        ref={contentBox}
                        style={{ display: show ? 'none' : '', transition: 'none' }}
                        className='bg-white mb-[131px] w-full'
                    >
                        <div
                            className='flex py-5 px-6 justify-between'
                            style={{ borderBottom: '0.5px solid rgba(0,0,0,.1)' }}
                        >
                            <div className='flex items-center'>
                                <img
                                    className='rounded-3xl w-[40px] h-[40px] mx-2'
                                    src={publication.profile.picture ? formatPicture(publication.profile.picture) : user}
                                    alt=""
                                />
                                <span>{publication.profile.name ? publication.profile.name : formatNickName(publication.profile.handle)}</span>
                            </div>


                            <WhenLoggedInWithProfile>
                                {({ profile }) =>
                                    <FollowButton followee={publication.profile} follower={profile} />}
                            </WhenLoggedInWithProfile>


                        </div>
                        <div id='noteDetail' className='h-[calc(100%-81px)] overflow-auto'>
                            <InfiniteScroll
                                dataLength={commentPage.length}
                                next={moreComment}
                                hasMore={hasMore}
                                loader={
                                    <div
                                        className='w-full flex items-center justify-center h-[50px] mb-[20px]'
                                    >
                                        <Spin tip="Loading" size="large" />
                                        <span className='text-[13px] ml-[15px]'>加载中</span>
                                    </div>
                                }
                                scrollableTarget='noteDetail'
                            >
                                <div
                                    className='mx-[30px] pb-[30px] pt-[10px]'
                                    style={{ borderBottom: '0.5px solid rgba(0,0,0,.1)' }}
                                >
                                    <div className='mb-5 font-semibold text-[20px] leading-8'>
                                        {publication.metadata.title && publication.metadata.title}
                                    </div>
                                    <div
                                        className='text-[17px] whitespace-pre-wrap'
                                        dangerouslySetInnerHTML={{ __html: publication.metadata.content && publication.metadata.content }}
                                    >
                                    </div>
                                    <div className='mt-2 text-[14px] leading-6 text-[#33333399]'>
                                        {formatDate(publication.createdAt)}
                                    </div>
                                </div>
                                <div className='px-[30px] py-[20px]'>
                                    <div className='mt-[16px]'>
                                        <Comment
                                            ref={appendReplyRef}
                                            item={commentPage}
                                            total={item.stats ? item.stats.totalAmountOfComments : 0}
                                        >
                                        </Comment>
                                    </div>
                                </div>
                            </InfiniteScroll>
                        </div>
                        <footer
                            className='border-t fixed bottom-[0] bg-white py-[10px] px-[30px]'
                            style={{ width: `${contentSize}px` }}
                        >
                            <div className='h-[50px] rounded-3xl shadow w-full mb-[10px] py-[7px] px-[15px] flex justify-between'>


                                <WhenLoggedInWithProfile>
                                    {({ profile }) =>
                                        <ReactionButton publication={publication} profileId={profile.id} reactionType={ReactionType.UPVOTE} />}
                                </WhenLoggedInWithProfile>

                                <WhenLoggedInWithProfile>
                                    {({ profile }) =>
                                        <CollectButton collector={profile} publication={publication} />}
                                </WhenLoggedInWithProfile>



                                <div className='w-[70px] rounded-3xl bg-[#50b674] cursor-pointer p-[5px] text-[#fff] text-center'>
                                    分享
                                </div>
                            </div>
                            <div className='h-[50px] rounded-3xl w-full flex'>
                                <div className='w-[calc(100%-95px)] mr-[15px] shadow p-[5px] h-[50px] bg-[#f9f9f9] rounded-3xl'>
                                    <Input
                                        ref={commentRef}
                                        className='h-full text-[16px]'
                                        placeholder="期待您的精彩评论"
                                        bordered={false}
                                    />
                                </div>
                                <Button loading={messageReplyButtonLoading} className='h-full bg-[#6790db] cursor-pointer w-[80px] rounded-3xl flex justify-center items-center text-[#fff] text-[16px]'
                                    onClick={sendComment}>
                                    发送
                                </Button>
                            </div>
                        </footer>
                    </div>
                </div>
            </div >
        </>
    );
}
