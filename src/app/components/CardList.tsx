
import React, { useRef, useEffect } from 'react'
import useState from 'react-usestateref'
import CardAnt from './CardAnt'
import { FloatButton, Spin } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import ContentHomeLoader from './loading/ContentHomeLoader';

// import Macy from 'macy';
// @ts-expect-error
interface CardListProps {
    cardClick: any;
    dataObj: {
        data: any[];
        loading: boolean;
        hasMore: boolean;
        next: () => Promise<void>;
        reset: () => Promise<void>;
    };
    children?: React.ReactNode; // 添加这一行
}

const CardList: React.FC<CardListProps> = ({ children, cardClick, dataObj }) => {

    let [cardSize, setCardSize, cardSizeRef] = useState(4);

    let [cardWidth, setCardWidth, cardWidthRef] = useState(0);

    const cards = useRef({
        offsetWidth: undefined
    });

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
            let msnry = new Masonry(elem, {
                // options
                itemSelector: '.CardAnt',
                columnWidth: cardWidth,
            });
            let msnry2 = new Masonry('.scrollableDiv', {
                gutter: 20
            });
        }
    }

    useEffect(() => {
        bodyWidth();
    }, []);

    const nextList = async () => {
        await dataObj.next();
    }

    //滚动监听
    function handleScroll(e) {

        if (!dataObj.loading && dataObj.hasMore) {
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
                {dataObj.loading && dataObj.data.length === 0 ? <ContentHomeLoader></ContentHomeLoader> :
                    <div id='scrollableDiv' className='scrollableDiv w-full flex justify-between flex-wrap'>
                        {dataObj.data.map((item, index) => (
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
                }
                {!dataObj.hasMore && dataObj.data.length === 0 ? '' :
                    <div
                        className='w-full flex items-center justify-center h-[50px] mb-[20px]'
                        style={
                            dataObj.loading ?
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
                        macyInfo()
                    }}
                />
                <FloatButton.BackTop
                    target={() => (cards.current)}
                    visibilityHeight={100}
                />
            </FloatButton.Group>
        </>
    )
};

export default CardList;
