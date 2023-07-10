
import React, { useRef, useEffect, useReducer } from 'react'
import useState from 'react-usestateref'

import CardAnt from './CardAnt'
import { Tab } from '@headlessui/react'
import { useExplorePublications } from '@lens-protocol/react-web';

import API from "../../api/api";
import {FloatButton, Skeleton, Spin} from 'antd';
import { SyncOutlined } from '@ant-design/icons';

import Macy from 'macy'

const LayoutContent = React.forwardRef(({ cardClick, searchParam, dataList, setParam }, ref) => {

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

    const cardPosition = (img, index) => {
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
        console.log('macyInfo')
        const columns = cardSizeRef.current;
        let macy = Macy({
            container: '#scrollableDiv', // 图像列表容器id
            trueOrder: false,
            waitForImages: false,
            useOwnImageLoader: false,
            debug: true,

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
        const obj = {
            "current": 1,
            "size": 20,
            ...searchParam
        };
        setQueryParam(obj);
        setParam(obj)
    }

    const loadMore = async () => {
        if (isLoadingRef.current) {
            return
        }
        setIsMax(false)
        setIsLoading(true)
        // const { error, data } = await getContent();
        const data = dataList;
        if (data) {
            const obj = [...cardListRef.current, ...data];
            setCardList(obj);
            if (obj.length >= data.total) {
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
        setParam(obj)
    }

    useEffect(() => {
        bodyWidth();
        getKeyword()
    }, []);

    useEffect(() => {
        if (dataList) {
            loadMore();
        }
    }, [dataList]);

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
            setParam(obj)
        }
        // refresh()
    },[searchParam]);

    const nextPage = () => {
        setIsMax(true)
        const current = queryParamRef.current.current + 1;
        const obj = {
            "current": current,
            "size": 20,
            ...searchParam
        }
        setQueryParam(obj)
        setParam(obj)
    }

    //滚动监听
    function handleScroll(e) {
        if (!isLoadingRef.current && !isMaxRef.current) {
            const top = e.target.scrollTop;
            const height = e.target.clientHeight;
            const allHeight = e.target.scrollHeight;
            if (allHeight - height - top < 500) {
                console.log('加载');
                nextPage();
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

export default LayoutContent;
