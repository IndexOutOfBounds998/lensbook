
import React, { useRef, useEffect, useReducer } from 'react'
import useState from 'react-usestateref'
import ReactDom from 'react-dom'
import CardAnt from './CardAnt'
import { Tab } from '@headlessui/react'
import { useExplorePublications } from '@lens-protocol/react-web';
import InfiniteScroll from "react-infinite-scroll-component";

import { FloatButton, Skeleton, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import Macy from 'macy';

const LayoutContent = React.forwardRef(({ cardClick, searchParam, setParam, dataObj }, ref) => {

    let [cardList, setCardList, cardListRef] = useState([]);

    let [cardSize, setCardSize, cardSizeRef] = useState(4);

    let [cardWidth, setCardWidth, cardWidthRef] = useState();

    let [imgSize, setImgSize, imgSizeRef] = useState({});

    let [queryParam, setQueryParam, queryParamRef] = useState();

    let [isLoading, setIsLoading, isLoadingRef] = useState(false);

    let [isMax, setIsMax, isMaxRef] = useState(false);

    // const getContent = useImperativeQuery(API[apiName](queryParamRef.current || {}));
    // let getContent = GetCardList(queryParamRef.current);

    const cards = useRef();

    React.useImperativeHandle(ref, () => ({
        handleScroll: handleScroll,
        refresh: refresh,
    }));

    const bodyWidth = () => {
        // const cardsList = document.getElementsByClassName('scrollableDiv')[0];
        // cardsList.setAttribute('id', 'scrollableDiv');
        if (cards.current) {
            const width = cards.current.offsetWidth;
            let size = 4;
            if (width > 1280) {
                size = (width / 1280 * 4) > 4.5 ? 5 : 4;
            }
            setCardWidth((width / size) - 20);
            setCardSize(size);
        }
    }

    const cardPosition = (img: { height: number, width: number }, index: number) => {
        const imgObj = imgSizeRef.current;
        imgObj[index] = {
            height: img.height,
            width: img.width,
        };
        if (cardListRef.current.length === Object.keys(imgObj).length) {
            setImgSize(imgObj)
            setTimeout(() => (macyInfo()), 500)
        }
        macyInfo()
    }

    const macyInfo = () => {
        const columns = cardSizeRef.current;
        let macy = Macy({
            container: '#scrollableDiv', // 图像列表容器id
            trueOrder: false,
            waitForImages: false,
            useOwnImageLoader: false,
            debug: false,

            //设计间距
            margin: {
                x: 20,
                y: 20
            },

            //设置列数
            columns: columns,
        });
        macy.runOnImageLoad(() => {
            macy.recalculate()
        }, true)
    }
    //刷新
    const refresh = () => {
        setCardList([]);
        setImgSize({})
        setIsMax(false);
        macyInfo()
    }

    const loadMore = async () => {
        if (isLoadingRef.current) {
            return
        }
        setIsMax(false)
        setIsLoading(true)
        const data = dataObj.data;
        if (data) {
            setCardList(data);
            if (!dataObj.hasMore) {
                setIsMax(true)
            }
            setIsLoading(false)
            macyInfo()
        }
    }
    //初始化queryParam
    const getKeyword = () => {
        let obj = {
            "current": 1,
            "size": 20,
        }
        setQueryParam(obj)
    }

    useEffect(() => {
        bodyWidth();
        getKeyword()
    }, []);

    useEffect(() => {
        if (!dataObj.loading) {
            console.log(dataObj.data)
            loadMore();
        }
    }, [dataObj.data])

    useEffect(() => {
        if (queryParam) {
            setCardList([]);
            setImgSize({})
            setIsMax(false);
            const columns = cardSizeRef.current;
            let macy = Macy({
                container: '#scrollableDiv', // 图像列表容器id
                trueOrder: false,
                waitForImages: false,
                useOwnImageLoader: true,
                debug: true,

                //设计间距
                margin: {
                    x: 20,
                    y: 20
                },

                //设置列数
                columns: columns,
            });
            macy.recalculate()
            const obj = {
                "current": 1,
                "size": 20,
                ...searchParam
            }
            setQueryParam(obj);
        }
        // refresh()
    }, [searchParam]);

    const nextList = () => {
        try {
             dataObj.next();
        } catch (error) {
            
        }
       
    }

    //滚动监听
    function handleScroll(e) {
        if (!isLoadingRef.current && !isMaxRef.current) {
            const top = e.target.scrollTop;
            const height = e.target.clientHeight;
            const allHeight = e.target.scrollHeight;
            if (allHeight - height - top < 500) {
                console.log('加载');
                nextList();
            }
        }
    }

    return (
        <>
            <div ref={cards} className='h-[calc(100%-68px)] overflow-auto' onScroll={handleScroll}>
                <div id='scrollableDiv' className='w-full flex justify-between flex-wrap'>
                    {cardListRef.current.map((item, index) => (
                        <CardAnt
                            key={index}
                            item={item}
                            index={index}
                            cardClick={cardClick}
                            width={cardWidthRef.current}
                            cardPosition={cardPosition}
                        />
                    ))}
                </div>
                {isMax ? '' :
                    <div
                        className='w-full flex items-center justify-center h-[50px] mb-[20px]'
                        style={
                            isLoadingRef.current ?
                                {display: 'flex'} :
                                {display: 'none', height: '50px'}
                        }
                    >
                        <Spin tip="Loading" size="large"/>
                        <span className='text-[13px] ml-[15px]'>加载中</span>
                    </div>
                }
            </div>

            {/*<div*/}
            {/*    ref={cards}*/}
            {/*    id='cardsList'*/}
            {/*    className='h-[calc(100%-68px)] overflow-auto'*/}
            {/*>*/}
            {/*    <InfiniteScroll*/}
            {/*        dataLength={cardList.length}*/}
            {/*        next={nextList}*/}
            {/*        hasMore={ dataObj.hasMore}*/}
            {/*        className='w-full flex justify-between flex-wrap scrollableDiv'*/}
            {/*        loader={*/}
            {/*            <div*/}
            {/*                className='w-full flex items-center justify-center h-[50px] mb-[20px]'*/}
            {/*            >*/}
            {/*                <Spin tip="Loading" size="large" />*/}
            {/*                <span className='text-[13px] ml-[15px]'>加载中</span>*/}
            {/*            </div>*/}
            {/*        }*/}
            {/*        scrollableTarget='cardsList'*/}
            {/*    >*/}
            {/*            {cardList.map((item, index) => (*/}
            {/*                <CardAnt*/}
            {/*                    key={index}*/}
            {/*                    item={item}*/}
            {/*                    index={index}*/}
            {/*                    cardClick={cardClick}*/}
            {/*                    width={cardWidthRef.current}*/}
            {/*                    cardPosition={cardPosition}*/}
            {/*                />*/}
            {/*            ))}*/}
            {/*    </InfiniteScroll>*/}
            {/*</div>*/}
            <FloatButton.Group
                style={{
                    right: 94,
                }}
            >
                <FloatButton
                    icon={<SyncOutlined />}
                    onClick={() => {
                        refresh()
                    }}
                />
                <FloatButton.BackTop
                    target={() => (cards.current)}
                    visibilityHeight={100}
                />
            </FloatButton.Group>
        </>
    )
});


LayoutContent.displayName = 'LayoutContent';

export default LayoutContent;
