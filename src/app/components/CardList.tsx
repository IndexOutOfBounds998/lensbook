
import React, { useRef, useEffect } from 'react'
import useState from 'react-usestateref'
import CardAnt from './CardAnt'
import { FloatButton, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

// import Macy from 'macy';
// @ts-ignore
const LayoutContent = React.forwardRef(({ cardClick, searchParam, setParam, dataObj }, ref) => {

    let [cardList, setCardList, cardListRef] = useState([]);

    let [cardSize, setCardSize, cardSizeRef] = useState(4);

    let [cardWidth, setCardWidth, cardWidthRef] = useState(0);

    let [imgSize, setImgSize, imgSizeRef] = useState({});

    let [queryParam, setQueryParam, queryParamRef] = useState();

    let [isLoading, setIsLoading, isLoadingRef] = useState(false);

    let [isMax, setIsMax, isMaxRef] = useState(false);

    const cards = useRef({
        offsetWidth: undefined
    });

    React.useImperativeHandle(ref, () => ({
        handleScroll: handleScroll,
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
        macyInfo()
    }

    const macyInfo = () => {
        if (typeof window !== 'undefined') {
            let elem = document.querySelector('.scrollableDiv');
            let msnry = new Masonry( elem, {
                // options
                itemSelector: '.CardAnt',
                columnWidth: cardWidth,
            });
            let msnry2 = new Masonry( '.scrollableDiv', {
                gutter: 20
            });
        }
    }

    const loadMore = async () => {
        setIsMax(false)
        setIsLoading(true)
        const data = dataObj.data;
        if (data) {
            setCardList(data);
            if (!dataObj.hasMore) {
                setIsMax(true)
            }
            setTimeout(() => (setIsLoading(false)), 500)

            macyInfo()

        }
    }

    useEffect(() => {
        bodyWidth();
    }, []);

    useEffect(() => {
        console.log(dataObj.data)
        if (!dataObj.loading) {
            console.log(dataObj.data)
            loadMore();
        }
    }, [dataObj.data])

    const nextList = async () => {
        setIsLoading(true)
        await dataObj.next();
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
            <div className='h-[calc(100%-68px)] overflow-auto' onScroll={handleScroll}>
                <div ref={cards} id='scrollableDiv' className='scrollableDiv w-full flex justify-between flex-wrap'>
                    {cardListRef.current.map((item, index) => (
                        <CardAnt
                            className='CardAnt'
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
                                { display: 'flex' } :
                                { display: 'none', height: '50px' }
                        }
                    >
                        <Spin tip="Loading" size="large" />
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
                       dataObj.reset()
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
