import user from "../../../assets/user.jpg";
import React, { useEffect, useState } from "react";

const icon = (icon) => (
    <i className={`iconfont icon-${icon} text-[16px] mr-[5px]`} />
);

const Comment = React.forwardRef(({ item, total }, ref) => {
    const [commentPage, setCommentPage] = useState([]);
    const [page, setPage] = useState({ current: 1, size: 20 });
    const [hasMore, setHasMore] = useState(true);

    const getComments = async () => {

    };

    const commentText = (comment) => {
        try {
            return JSON.parse(comment).content;
        } catch (e) {
            return comment;
        }
    };

    const updateReplay = (item) => {
        setCommentPage(item);
    };

    React.useImperativeHandle(ref, () => ({
        updateReplay: updateReplay,
        loadMore: loadMore
    }));

    useEffect(() => {
        console.log(item)
    }, [item]);

    useEffect(() => {
        if (item.profileId && item.pubId) {
            getComments();
        }
    }, [page]);

    // useEffect(() => {
    //     setMore(hasMore)
    // }, [hasMore]);

    const refresh = () => {
        setPage({ current: 1, size: 20 });
        setHasMore(true);
        getComments();
    };

    const loadMore = () => {
        if (hasMore) {
            setPage(prevPage => ({ current: prevPage.current + 1, size: prevPage.size }))
        }
    };

    return (
        <div>
            <p className="text-[#666] mb-[20px]">一共 { total } 条评论</p>
            {item.map((item) => (
                <div key={item.id} className="flex mb-[16px]">
                    <div>
                        <img className="rounded-3xl w-[32px]" src={item.profile.picture} alt="" />
                    </div>
                    <div className="ml-[12px] flex flex-col w-full">
              <span className="leading-[18px] text-[#33333399]">
                {item.profile.name}
              </span>
                        <div className="text-[#333333] mt-[7px] leading-[22px]">
                            {item.metadata.content}
                        </div>
                        <div className="flex mt-[12px] justify-between text-[13px] text-[#999]">
                            <span className="">21:54 江苏</span>
                            <div className="flex text-[14px]">
                                <div className="cursor-pointer hover:text-[#333333]">
                                    {icon("xihuan1")}
                                    <span></span>
                                </div>
                                <div className="cursor-pointer ml-[20px] hover:text-[#333333]">
                                    {icon("icon-message")}
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

export default Comment;
