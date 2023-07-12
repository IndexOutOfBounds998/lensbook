import React, { useRef, useEffect, useState, useReducer } from 'react'
import { Tab } from '@headlessui/react'
import CardList from "./CardList";
import { useExplorePublications, PublicationTypes, PublicationMainFocus } from '@lens-protocol/react-web';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function LayoutContent({cardClick}) {

    let [categories, setCategory] = useState([]);

    const { data, loading, hasMore, next } = useExplorePublications({
        limit: 20,
        publicationTypes: [PublicationTypes.Post],
        metadataFilter: {
            restrictPublicationMainFocusTo: [PublicationMainFocus.Image]
        }
    });

    const tabCheck = (index) => {

    }

    useEffect(() => {
        loadCategory();
    }, []);

    // const refresh = async () => {
    //     setShowContent(false);
    // }

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
                dataObj={{ data, loading, hasMore, next }}
            >
            </CardList>
        </div>
    )
}
