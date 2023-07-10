import user from '../../../assets/user.jpg'
import Comment from "./Comment";
import React, { useEffect, useRef, useState } from "react";
import { message, Button, notification, Spin } from "antd";
import Input from "antd/es/input";
import { AUTHORIZE_PREFIX, HUB_CONTRACT_ADDRESS,FREE_COLLECT_MODULE ,ZERO_ADDRESS} from '../../constants/constant';
import InfiniteScroll from "react-infinite-scroll-component";
import { formatNickName, formatDate } from "../../util/FormatContent";
import { useTranslation } from "react-i18next";

export default function NoteDetail({ card, img, item, setShowDetail }) {
    const [messageApi, contextHolder] = message.useMessage();
    const [notificationApi, contextHolderNotification] = notification.useNotification();
    const [followButtonLoading, setFollowButtonLoading] = useState(false);

    const { t } = useTranslation();
    const [messageReplyButtonLoading, setMessageReplyButtonLoading] = useState(false);

    let flag = true;
    let [contentDetail, setContentDetail] = useState({});//帖子详情
    //不要放到一个对象里 容易混淆 各自负责各自的职责
    let [isFollowingStatus, setIsFollowing] = useState(false);//是否关注
    let [isCollectionStatus, setIsCollected] = useState(false);//是否收藏
    let [isFavouriteStatus, setIsFavourite] = useState(false);//是否点赞
    let [favouriteCount, setFavouriteCount] = useState(0);//点赞数
    let [collectionCount, setCollectionCount] = useState(0);//收藏数

    let [show, setShow] = useState(true);
    let [bgSize, setBgSize] = useState(0);
    let [contentSize, setContentSize] = useState(0);
    let [commentPage, setCommentPage] = useState([]);
    let [hasMore, setHasMore] = useState(true);//是否有更多评论
    let [isOwn, setIsOwn] = useState(false);//是否是本人的帖子

    const detail = useRef();
    const imgBox = useRef();
    const contentBox = useRef();
    const commentRef = useRef();

    // const { contract } = useContract(HUB_CONTRACT_ADDRESS, contract_abi);
    // const follow_address = contentDetail.user ? contentDetail.user.followNft : '';
    // const followContract = useContract(follow_address, follow_abi);
    // const authConfig = useThirdwebAuthContext();

    const appendReplyRef = useRef(null);

    // //关注
    // const { mutate: follow, isLoadingWrite, errorWrite } = useContractWrite(
    //     contract,
    //     "follow",
    // );
    // //取消关注
    // const { mutate: burn, burnLoading, burnError } = useContractWrite(
    //     followContract.contract,
    //     "burn",
    // );
    // //收藏
    // const { mutate: collect, collectLoading, collectError } = useContractWrite(
    //     contract,
    //     "collect",
    // );
    // //点赞
    // const [addLike] = useMutation(API.LIKE({ profileId: parseInt(item.profileId), pubId: parseInt(item.pubId) }))
    // //取消点赞
    // const [disLike] = useMutation(API.DISLIKE({ profileId: parseInt(item.profileId), pubId: parseInt(item.pubId) }))
    // //评论
    // const { mutate: comment, commentLoading, commentError } = useContractWrite(
    //     contract,
    //     "comment",
    // );
    // //帖子内容
    // const getContentDetail = useImperativeQuery(API.GET_CONTENT_DETAIL({
    //     pubId: JSON.stringify(item.pubId),
    //     profileId: JSON.stringify(item.profileId)
    // }));
    // //是否关注
    // const isFollow = async (obj) => {
    //     const res = await isFollowing({
    //         params: {
    //             profile_id: obj.profileId
    //         }
    //     })
    //     if (res) return res.data;
    //     return false
    // }
    // //是否收藏
    // const isCollect = async (obj) => {
    //     const res = await isCollection({
    //         params: {
    //             profile_id: obj.profileId,
    //             pub_id: obj.pubId,
    //         }
    //     })
    //     if (res) return res.data;
    //     return false
    // }
    //获取帖子内容
    const getDetail = async () => {

    }

    const Icon = (item) => (
        <div className='flex items-center' style={{ color: item.color }}>
            <i className={`iconfont icon-${item.icon} cursor-pointer text-[25px] mr-3`} />
            <span className='font-bold'>{item.text}</span>
        </div>
    );

    const contentResponse = (item) => {
        return contentDetail.contentResponse ? contentDetail.contentResponse[item] : '';
    }

    useEffect(() => {
        if (flag) {
            // imgSize();
            getDetail();
            scaleDown();
        }
    }, []);

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

    const oneself = (obj) => {
        const userData = localStorage.getItem('userData');
        let profileId;
        try {
            profileId = JSON.parse(userData).profileId;
        } catch (e) {
            profileId = '';
        }
        setIsOwn(parseInt(obj.profileId) === profileId)
    }
    //点击关注
    const clickFollow = () => {

    }
    //点击收藏
    const clickCollection = () => {

    }
    //点击点赞
    const clickLike = async () => {

    }
    //发布评论
    const sendComment = async () => {

    }
    //加载更多评论
    const moreComment = () => {

    }

    useEffect(() => {
        console.log(commentPage)
    }, [commentPage])
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
                                backgroundImage: `url(${img.src})`,
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
                                    src={contentDetail.user ? contentDetail.user.avatar : user}
                                    alt=""
                                />
                                <span>{contentDetail.user ? formatNickName(contentDetail.user.nickname) : ''}</span>
                            </div>


                            {isOwn ? ('') : (<Button
                                loading={followButtonLoading}
                                className='flex items-center cursor-pointer justify-center rounded-3xl w-[74px] h-[40px] text-[15px]'
                                style={
                                    isFollowingStatus ?
                                        { background: '#3333330d', color: '#33333399' } :
                                        { background: '#ff2442', color: '#fff' }
                                }
                                onClick={clickFollow}
                            >
                                {
                                    isFollowingStatus ? '已关注' : '关注'
                                }
                            </Button>)}


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
                                        {contentResponse('title')}
                                    </div>
                                    <div
                                        className='text-[17px] whitespace-pre-wrap'
                                        dangerouslySetInnerHTML={{ __html: contentResponse('content') }}
                                    >
                                    </div>
                                    <div className='mt-2 text-[14px] leading-6 text-[#33333399]'>
                                        {formatDate(contentDetail.createTime)}
                                    </div>
                                </div>
                                <div className='px-[30px] py-[20px]'>
                                    <div className='mt-[16px]'>
                                        <Comment
                                            ref={appendReplyRef}
                                            item={contentDetail}
                                            setData={setCommentPage}
                                            setMore={setHasMore}
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
                                {
                                    operate.map((item) => (
                                        <div key={item.icon} onClick={item.onClick}>
                                            {Icon(item)}
                                        </div>
                                    ))
                                }
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