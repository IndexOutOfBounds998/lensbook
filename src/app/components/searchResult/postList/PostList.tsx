
import React, { useRef, useEffect, useState } from 'react'
import type { TabsProps } from 'antd';
import {useTranslation} from "react-i18next";
import {Tabs} from "antd";
import '../../style/SearchResult.css'

// import Macy from 'macy';
// @ts-ignore
interface SearchResultProps {
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

const SearchResult: React.FC<SearchResultProps> = ({  }) => {

    const { t } = useTranslation();

    let [cardSize, setCardSize, cardSizeRef] = useState(4);

    let [cardWidth, setCardWidth, cardWidthRef] = useState(0);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: t('user'),
            children: `Content of Tab Pane 1`,
        },
        {
            key: '2',
            label: t('post'),
            children: `Content of Tab Pane 2`,
        },
    ];

    const onChange = (key: string) => {
        console.log(key);
    };

    return (
        <div className='w-full'>
            <div>
                <Tabs
                    defaultActiveKey="1"
                    centered={true}
                    size='large'
                    items={items}
                    onChange={onChange}
                />
            </div>
            <div>

            </div>
        </div>
    )
};

export default SearchResult;
