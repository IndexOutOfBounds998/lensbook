import React, { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { PublicationTypes, PublicationMainFocus } from '@lens-protocol/react-web';
import CardList from "../../components/CardList";
import { PublicationSortCriteria } from '@lens-protocol/client';
import { useFetchPublications } from '@/app/hooks/useFetchPublications';
import { Select } from "antd";
import { useTranslation } from "react-i18next";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function LayoutContent({ cardClick }) {

    let [categories, setCategory] = useState([]);

    const { t } = useTranslation();

    const [selectedOption, setSelectedOption] = useState(PublicationSortCriteria.Latest);

    const options = [
        {
            value: PublicationSortCriteria.Latest,
            label: t('LatestSort'),
        },
        {
            value: PublicationSortCriteria.TopCollected,
            label: t('TopCollectedSort'),
        },
        {
            value: PublicationSortCriteria.TopCommented,
            label: t('TopCommentedSort'),
        },
        {
            value: PublicationSortCriteria.TopMirrored,
            label: t('TopMirroredSort'),
        },
    ];

    const explorePublicationRequest = {
        cursor: JSON.stringify({
            timestamp: 1,
            offset: 0,
            filter: JSON.stringify({
                mainContentFocus: [PublicationMainFocus.Image, PublicationMainFocus.Video]
            })
        }),
        sortCriteria: selectedOption,
        limit: 20,
        publicationTypes: [PublicationTypes.Post],
        sources: ['lenster', 'lenstrip', "lenstube", "orb", "buttrfly", "lensplay"]
    };

    const { data, loading, firstLoading, hasMore, next, reset, changeFilter } = useFetchPublications({
        explorePublicationRequest
    });


    const tabCheck = (index) => {

    }

    const selectChange = (value) => {
        changeFilter(value);
    }

    const onMenuOpen = (value) => {
        console.log(value)
    }

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

    useEffect(() => {
        loadCategory();
    }, []);



    return (
        <div className="w-[calc(100%-20rem)] pl-8 pr-3 h-full">
            <div className='flex items-center justify-between'>
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
                <Select
                    defaultValue={selectedOption}
                    onChange={selectChange}
                    style={{ width: 120 }}
                    options={options}
                />
            </div>
           
                <CardList
                    cardClick={cardClick}
                    dataObj={{ data, loading, hasMore, next, reset }}
                >
                </CardList>
          
        </div>
    )
}
