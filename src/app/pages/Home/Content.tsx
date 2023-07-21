import React, { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { PublicationTypes, PublicationMainFocus } from '@lens-protocol/react-web';
import CardList from "../../components/CardList";
import { PublicationSortCriteria, ExplorePublicationRequest } from '@lens-protocol/client';
import { useFetchPublications } from '@/app/hooks/useFetchPublications';
import { Select } from "antd";
import ContentHomeLoader from '@/app/components/loading/ContentHomeLoader';
import { useTranslation } from "react-i18next";
import { useTrending } from '@/app/hooks/useTrending';

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

    let explorePublicationRequest: ExplorePublicationRequest = {
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
        metadata: {
            tags: {
                all: []
            }
        },
        sources: ['lenster', 'lenstrip', "lenstube", "orb", "buttrfly", "lensplay"]
    };

    const { data, loading, firstLoading, hasMore, next, reset, changeFilter } = useFetchPublications({
        explorePublicationRequest
    });


    const tabCheck = (index) => {
        let categoryItem = categories[index];
        if (categoryItem && categoryItem.tag !== 'All') {
            explorePublicationRequest.metadata.tags.all = [categoryItem.tag];
            changeFilter(explorePublicationRequest);
        } else {
            explorePublicationRequest.metadata.tags.all = [];
            changeFilter(explorePublicationRequest);
        }
    }

    const selectChange = (value) => {
        explorePublicationRequest.sortCriteria = value;
        changeFilter(explorePublicationRequest);
    }

    const onMenuOpen = (value) => {
        console.log(value)
    }
    const { data: categoryData, loading: categoryLoading } = useTrending({
        limit: 10
    });


    const loadCategory = async () => {
        setCategory(categoryData);
    }

    useEffect(() => {
        loadCategory();
    }, [categoryLoading]);



    return (
        <div className="w-[calc(100%-20rem)] pl-8 pr-3 h-full">
            <div className='flex items-center justify-between'>
                <Tab.Group
                    onChange={(index) => {
                        tabCheck(index)
                    }}
                >
                    <Tab.List className="flex space-x-1 rounded-xl p-1  mb-4">
                        {categories.map((category, index) => (
                            <Tab
                                key={index}
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
                                {category.tag}
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
            {firstLoading ? <ContentHomeLoader /> :
                <CardList
                    cardClick={cardClick}
                    dataObj={{ data, loading, hasMore, next, reset }}
                >
                </CardList>
            }
        </div>
    )
}
