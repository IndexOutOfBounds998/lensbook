import user from "../../assets/user.jpg";
import Comment from "../pages/Home/Comment";
import React, { useEffect, useRef, useState } from "react";
import { message, notification, Spin, Skeleton, Carousel } from "antd";
import Input from "antd/es/input";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  formatNickName,
  formatDate,
  formatVideoUrl,
  formatPicture,
} from "../utils/FormatContent";
import { useTranslation } from "react-i18next";
import {
  useComments,
  ReactionType,
  usePublication,
  ContentPublication,
  Post,
} from "@lens-protocol/react-web";
import { WhenLoggedInWithProfile } from "@/app/components/auth/WhenLoggedInWithProfile";
import FollowButton from "@/app/components/button/FollowButton";
import CollectButton from "@/app/components/button/CollectButton";
import ReactionButton from "@/app/components/button/ReactionButton";
import SendCommentButton from "@/app/components/button/SendCommentButton";
import ReactPlayer from "react-player";
import FollowButtonWithOutProfile from "@/app/components/button/FollowButtonWithOutProfile";
import "@/app/style/Carousel.css";
import { NextSeo } from "next-seo";
import { useActiveProfile } from "@lens-protocol/react-web";
import Link from "next/link";
import MirrorButton from "./button/MirrorButton";
export default function NoteDetail({ card, img, item, setShowDetail }) {
  const { data: profile } = useActiveProfile();

  const { data: publication, loading: publication_loading } = usePublication({
    publicationId: item.id,
    observerId: profile?.id,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const [notificationApi, contextHolderNotification] =
    notification.useNotification();

  const { t } = useTranslation();

  let flag = true;

  let [carouselList, setCarouselList] = useState([]);
  let [comments, setComments] = useState([]);
  let [show, setShow] = useState(true);
  let [bgSize, setBgSize] = useState(0);
  let [contentSize, setContentSize] = useState(0);
  let [isVideo, setIsVideo] = useState(false);
  let [carouselIndex, setCarouselIndex] = useState(1);

  const detail = useRef<HTMLDivElement>(null);
  const imgBox = useRef<HTMLDivElement>(null);
  const contentBox = useRef<HTMLDivElement>(null);
  const commentRef = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const {
    data: commentsData,
    loading: commentsLoading,
    hasMore,
    next,
  } = useComments({
    commentsOf: item.id,
    limit: 10,
    observerId: profile?.id,
  });

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData]);

  useEffect(() => {
    if (flag) {
      scaleDown();
      setIsVideo(item.metadata.mainContentFocus === "VIDEO");
      console.log(item.metadata.media);
      setCarouselList(item.metadata.media);
    }
  }, []);

  useEffect(() => {
    if (card && flag) {
      flag = false;
      setTimeout(() => {
        if (detail.current) {
          setShow(false);
          scaleUp();
        }
      }, 100);
    }
  }, [card]);

  useEffect(() => {
    setContentSize(window.innerWidth * 0.7 - bgSize);
  }, [bgSize]);

  const scaleDown = () => {
    if (!img) {
      return;
    }
    const detailWidth = window.innerWidth * 0.7;
    const maxWidth = detailWidth * 0.6;
    const imgScale = (window.innerHeight - 64) / img.height;
    const imgWidth =
      img.width * imgScale > maxWidth ? maxWidth : img.width * imgScale;
    setBgSize(imgWidth);
    const cardWidth = card.current.offsetWidth;
    const scale = cardWidth / imgWidth;
    const client = card.current.getBoundingClientRect();
    detail.current.style.border = "none";
    detail.current.style.boxShadow = "none";
    detail.current.style.transform = `translate(${client.x}px,${
      client.y - 32
    }px) scale(${scale})`;
    detail.current.style.transformOrigin = "left top";
    if (imgBox.current) imgBox.current.style.backgroundPosition = "";
  };

  const scaleUp = () => {
    if (detail.current) {
      const detailWidth = (window.innerWidth - window.innerWidth * 0.7) / 2;
      detail.current.style.border = "1px solid #00000014";
      detail.current.style.boxShadow = "0 0 100px rgba(0,0,0,.1)";
      detail.current.style.transition = "all 0.5s ease";
      detail.current.style.transform = `translate(${detailWidth}px,0) scale(1)`;
      if (imgBox.current) imgBox.current.style.backgroundPosition = "50%";
    }
  };

  //加载更多评论
  const moreComment = () => {
    next();
  };

  return (
    <>
      {contextHolder}
      {contextHolderNotification}

      <NextSeo
        title={item.metadata?.content ? item.metadata.content : ""}
        description="lens book"
        canonical="https://testnet.0xtrip.xyz/"
        openGraph={{
          url: "https://testnet.0xtrip.xyz/",
          title: item.metadata?.content ? item.metadata.content : "",
          description: item.metadata?.content ? item.metadata.content : "",
          images: [
            {
              url: item.metadata?.media[0].original.url,
              width: 300,
              height: 400,
              alt: item.metadata?.media[0].original.altTag,
              type: item.metadata?.media[0].original.mimeType,
            },
          ],
          siteName: "lensbook",
        }}
        twitter={{
          handle: "@lensbook",
          site: "@https://testnet.0xtrip.xyz",
          cardType: "summary_large_image",
        }}
      />

      <div
        className="h-full w-full fixed top-0 z-[100]"
        style={{
          background: show ? "" : "hsla(0,0%,100%,.98)",
          transition: "all 0.5s ease",
        }}
        onClick={() => {
          scaleDown();
          setShow(true);
          setTimeout(() => {
            setShowDetail(false);
          }, 500);
        }}
      >
        <div
          ref={detail}
          className="h-[calc(100%-64px)] w-[70%] my-[32px] flex rounded-3xl overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="w-[auto] bg-[#f8f8f8] relative"
            style={{
              background: show ? "rgba(233,245,250,0)" : "",
              borderRadius: show ? "none" : "1rem",
              width: `${bgSize}px`,
              alignItems: isVideo && !show ? "center" : "",
            }}
          >
            <Carousel
              ref={carouselRef}
              className="h-full"
              afterChange={(val) => setCarouselIndex(val + 1)}
            >
              {carouselList.map((item, index) => (
                <div
                  key={index}
                  className={`note-detail-content h-full flex ${
                    isVideo && !show ? "items-center" : ""
                  }`}
                >
                  {isVideo ? (
                    <ReactPlayer
                      key={index}
                      url={formatVideoUrl(item.original.url)}
                      controls
                      loop
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <div
                      ref={imgBox}
                      key={index}
                      className="bg-no-repeat bg-contain h-full"
                      style={{
                        backgroundImage: `url(${formatPicture(item)})`,
                        width: `${bgSize}px`,
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </Carousel>
            {carouselList.length > 1 ? (
              <>
                <div className="absolute top-[20px] right-[30px] h-[25px] rounded-xl bg-[#33333399] px-[10px] py-[5px] flex items-center">
                  <span className="text-[#fff]">
                    {`${carouselIndex}/${carouselList.length}`}
                  </span>
                </div>
                <div
                  className="absolute top-[calc(50%-20px)] flex left-[20px] bg-[#fff] rounded-3xl w-[40px] h-[40px] cursor-pointer items-center border-[2px] justify-center"
                  onClick={() => carouselRef.current.prev()}
                >
                  <i className={`iconfont icon-icon-left text-[20px]`} />
                </div>
                <div
                  className="absolute top-[calc(50%-20px)] flex right-[20px] bg-[#fff] rounded-3xl w-[40px] h-[40px] cursor-pointer items-center border-[2px] justify-center"
                  onClick={() => carouselRef.current.next()}
                >
                  <i className={`iconfont icon-icon-right text-[20px]`} />
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div
            ref={contentBox}
            style={{
              display: show ? "none" : "",
              transition: "none",
              width: `${contentSize}px`,
            }}
            className={`bg-white mb-[131px]`}
          >
            <div
              className="flex py-5 px-6 justify-between"
              style={{ borderBottom: "0.5px solid rgba(0,0,0,.1)" }}
            >
              <div className="flex items-center">
                <Link href={`/profile/${item.profile.handle}`}>
                  <img
                    className="rounded-3xl w-[40px] h-[40px] mx-2"
                    src={
                      publication?.profile.picture
                        ? formatPicture(publication?.profile.picture)
                        : user
                    }
                    alt=""
                  />
                  <span>
                    {publication?.profile.name
                      ? publication?.profile.name
                      : formatNickName(publication?.profile.handle)}
                  </span>
                </Link>
              </div>

              <WhenLoggedInWithProfile>
                {({ profile }) => {
                  return publication_loading ? (
                    ""
                  ) : profile ? (
                    <FollowButton
                      followee={publication?.profile}
                      follower={profile && profile}
                    />
                  ) : (
                    <FollowButtonWithOutProfile></FollowButtonWithOutProfile>
                  );
                }}
              </WhenLoggedInWithProfile>
            </div>
            <Skeleton loading={commentsLoading}>
              <div
                id="noteDetail"
                className="h-[calc(100%-81px)] overflow-auto"
              >
                <InfiniteScroll
                  dataLength={commentsLoading ? 0 : comments.length}
                  next={moreComment}
                  hasMore={hasMore}
                  loader={
                    <div className="w-full flex items-center justify-center h-[50px] mb-[20px]">
                      <Spin tip="Loading" size="large" />
                      <span className="text-[13px] ml-[15px]">
                        {t("loading")}
                      </span>
                    </div>
                  }
                  scrollableTarget="noteDetail"
                >
                  <div
                    className="mx-[30px] pb-[30px] pt-[10px]"
                    style={{ borderBottom: "0.5px solid rgba(0,0,0,.1)" }}
                  >
                    <div className="mb-5 font-semibold text-[20px] leading-8">
                      {publication && (publication as Post).metadata.title}
                    </div>
                    <div
                      className="text-[17px] whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html:
                          publication && (publication as Post).metadata.content,
                      }}
                    ></div>
                    <div className="mt-2 text-[14px] leading-6 text-[#33333399]">
                      {formatDate(publication?.createdAt)}
                    </div>
                  </div>
                  <div className="px-[30px] py-[20px]">
                    <div className="mt-[16px]">
                      <Comment
                        item={comments}
                        total={
                          item.stats ? item.stats.totalAmountOfComments : 0
                        }
                      ></Comment>
                    </div>
                  </div>
                </InfiniteScroll>
              </div>
            </Skeleton>
            <footer
              className="border-t fixed bottom-[0] bg-white py-[10px] px-[30px]"
              style={{ width: `${contentSize}px` }}
            >
              <div className="h-[50px] rounded-3xl shadow w-full mb-[10px] py-[7px] px-[15px] flex justify-between">
                <WhenLoggedInWithProfile>
                  {({ profile }) => {
                    return publication_loading ? (
                      ""
                    ) : (
                      <ReactionButton
                        publication={publication as ContentPublication}
                        profileId={profile?.id}
                        reactionType={ReactionType.UPVOTE}
                      />
                    );
                  }}
                </WhenLoggedInWithProfile>

                <WhenLoggedInWithProfile>
                  {({ profile }) => {
                    return publication_loading ? (
                      ""
                    ) : (
                      <CollectButton
                        collector={profile}
                        publication={publication as ContentPublication}
                      />
                    );
                  }}
                </WhenLoggedInWithProfile>

                {/* <div className='w-[70px] rounded-3xl bg-[#50b674] cursor-pointer p-[5px] text-[#fff] text-center'>
                                    {t('sharebtn')}
                                </div> */}
                <WhenLoggedInWithProfile>
                  {({ profile }) => {
                    return publication_loading ? (
                      ""
                    ) : (
                      <MirrorButton
                        publisher={profile}
                        publication={publication as ContentPublication}
                      />
                    );
                  }}
                </WhenLoggedInWithProfile>
              </div>
              <div
                className="h-[50px] rounded-3xl w-full flex"
                style={{
                  display:
                    publication && (publication as Post).canComment.result
                      ? ""
                      : "none",
                }}
              >
                <div className="w-[calc(100%-95px)] mr-[15px] shadow p-[5px] h-[50px] bg-[#f9f9f9] rounded-3xl">
                  <Input
                    ref={commentRef}
                    className="h-full text-[16px]"
                    placeholder={t("commentsTip")}
                    bordered={false}
                  />
                </div>

                <WhenLoggedInWithProfile>
                  {({ profile }) => {
                    return (
                      <SendCommentButton
                        comments={comments}
                        comment={commentRef.current}
                        profile={profile}
                        publication={publication}
                        onChange={setComments}
                      ></SendCommentButton>
                    );
                  }}
                </WhenLoggedInWithProfile>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
