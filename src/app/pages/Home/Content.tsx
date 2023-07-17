import React, { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { useExplorePublications, PublicationTypes, PublicationMainFocus } from '@lens-protocol/react-web';
import CardList from "../../components/CardList";
import { PublicationSortCriteria } from '@lens-protocol/client';
import { useFetchPublications } from '@/app/hooks/useFetchPublications';
// import dynamic from 'next/dynamic';
//
// const CardList = dynamic(import("../../components/CardList"), {
//   ssr: true,
//   loading: () => <p>Loading ...</p>, //异步加载组件前的loading状态
// });

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function LayoutContent({ cardClick }) {

    let [categories, setCategory] = useState([]);


    const explorePublicationRequest = {
        cursor: JSON.stringify({
            timestamp: 1,
            offset: 0,
            filter: JSON.stringify({
                mainContentFocus: [PublicationMainFocus.Image, PublicationMainFocus.Video]
            })
        }),
        sortCriteria: PublicationSortCriteria.Latest,
        limit: 20,
        publicationTypes: [PublicationTypes.Post],
        sources: ['lenster', 'lenstrip']
    };

    const { data, loading, hasMore, next, reset } = useFetchPublications({
        explorePublicationRequest
    });

    // const { data, loading, hasMore, next } = useExplorePublications({
    //     limit: 20,
    //     publicationTypes: [PublicationTypes.Post],
    //     metadataFilter: {
    //         restrictPublicationMainFocusTo: [PublicationMainFocus.Image]
    //     }
    // });

    const tabCheck = (index) => {

    }

    useEffect(() => {
        loadCategory();
    }, []);

    const loadCategory = async () => {
        setCategory([
            {
                "key": 0,
                "option": "全部",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 1,
                "option": "自驾游",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 2,
                "option": "周边游",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 3,
                "option": "风景",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 4,
                "option": "自由行",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 5,
                "option": "三日游",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 6,
                "option": "两日游",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 7,
                "option": "一日游",
                "__typename": "ContentTypeSetting"
            },
            {
                "key": 8,
                "option": "景点",
                "__typename": "ContentTypeSetting"
            }
        ])
    }

    return (
        <div className="w-[calc(100%-20rem)] pl-8 pr-3 h-full">
            <Tab.Group
                onChange={(index) => {
                    tabCheck(index)
                }}
            >
                <Tab.List className="flex space-x-1 rounded-xl p-1  mb-4">
                    {categories.map((category) => (
                        <Tab
                            key={category.key}
                            className={({ selected }) =>
                                classNames(
                                    'py-3 rounded-3xl px-5 leading-5 text-black',
                                    ' ring-opacity-60 ring-offset-2 focus:outline-none text-[16px]',
                                    selected
                                        ? 'bg-zinc-100 shadow font-bold'
                                        : 'text-black hover:bg-white/[0.12]'
                                )
                            }
                        >
                            {category.option}
                        </Tab>
                    ))}
                </Tab.List>
            </Tab.Group>
            <CardList
                cardClick={cardClick}
                dataObj={{ data, loading, hasMore, next, reset }}
            >
            </CardList>
        </div>
    )
}
