"use client";
import { Radio, Input, Button } from 'antd';
import React, { useEffect, useRef, useState } from "react";
import { usePost } from '../../hooks/usePost'
import { useTranslation } from "react-i18next";
import type { UploadFile } from 'antd/es/upload/interface';
import {
    useActiveProfile
} from '@lens-protocol/react-web';
const { TextArea } = Input;
import { useSearchParams  } from 'next/navigation'
import ReactPlayer from "react-player";

export default function Page() {

    const params = useSearchParams();
    //获取url中的ipfsUrl
    console.log(params.get('ipfsUrl'))

    const { t } = useTranslation();

    const btnClass =
        "w-[80px] inline-block mr-[80px] text-center font-bold text-[#fff] rounded p-2 cursor-pointer";

    let [isModalOpen, setIsModalOpen] = useState(false);
    let [stateValue, setStateValue] = useState('public');
    let [timeValue, setTimeValue] = useState('just');
    let [quillRef, setQuillRef] = useState();

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    let titleRef = useRef(undefined);

    const { data: profile, error, loading: profileLoading } = useActiveProfile();

    const showModal = () => {
        setIsModalOpen(true);
    };
    const callbackOnSuccess = () => {
        alert("发布成功")
    }
    const callbackOnError = (error) => {
        alert("发布失败" + error)
    }

    const { submit: post, postLoading } = usePost(callbackOnSuccess, callbackOnError);

    const onSubmit = async () => {

    };

    return (
        <div>
            <div className="w-full h-full bg-white overflow-y-scroll p-[30px] pl-[30px]">
                <div className="text-[20px] flex items-center">
                    <div className="w-[10px] h-[25px] inline-block bg-[blueviolet] rounded-3xl mr-1" />
                    <span>{t('postVideo')}</span>
                </div>
                <div className="p-[20px]">
                    <div className="mb-[10px]">
                        <p className="mb-[10px] text-[18px]">{t('videoEditing')}</p>
                        <ReactPlayer
                            url={params.get('ipfsUrl')}
                            controls
                            loop
                            width='200px'
                            height='300px'
                        />
                    </div>
                    <div className="mb-[16px]">
                        <Input
                            ref={titleRef}
                            showCount
                            maxLength={20}
                            className="mb-[16px]"
                            placeholder={t('enterTitle')}
                        />
                        <TextArea
                            value={quillRef}
                            onChange={(e) => setQuillRef(e.target.value)}
                            placeholder={t('enterContext')}
                            maxLength={1000}
                            showCount
                            autoSize={{
                                minRows: 4,
                            }}
                        />
                    </div>
                    <div className='flex justify-between w-[250px]'>
                        <Button className='px-[15px] py-[0] flex items-center'><span className=''># &nbsp;</span> {t('talk')}</Button>
                        <Button className='px-[15px] py-[0] flex items-center'><span className=''>@ &nbsp;</span> {t('user')}</Button>
                        <Button className='px-[15px] py-[0] flex items-center'>
                            <span
                                className=''
                                style={{
                                    width: '14px',
                                    height: '14px',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '100% 100%',
                                    backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEuMDUgN2E1Ljk1IDUuOTUgMCAxMTExLjkgMCA1Ljk1IDUuOTUgMCAwMS0xMS45IDB6TTcgMGE3IDcgMCAxMDAgMTRBNyA3IDAgMDA3IDB6IiBmaWxsPSIjMzQ1YWU2IiBmaWxsLW9wYWNpdHk9Ii44NSIvPjxwYXRoIGQ9Ik00LjcyNSA2LjY1YS44NzUuODc1IDAgMTAwLTEuNzUuODc1Ljg3NSAwIDAwMCAxLjc1ek05LjI3NSA2LjY1YS44NzUuODc1IDAgMTAwLTEuNzUuODc1Ljg3NSAwIDAwMCAxLjc1ek01LjUxMiA3Ljc3YS41MjUuNTI1IDAgMDEuNzE3LjE5MkEuODc4Ljg3OCAwIDAwNyA4LjRhLjg4Mi44ODIgMCAwMC43NzItLjQ0LjUyNS41MjUgMCAwMS45MDYuNTNjLS4yNy40NjMtLjgzOC45Ni0xLjY3OC45Ni0uODM5IDAtMS40MS0uNDk1LTEuNjgtLjk2MmEuNTI1LjUyNSAwIDAxLjE5Mi0uNzE3eiIgZmlsbD0iIzM0NWFlNiIgZmlsbC1vcGFjaXR5PSIuODUiLz48L3N2Zz4=)'
                                }}
                            />&nbsp;{t('emtoe')}
                        </Button>

                    </div>
                    <div className="text-[13px]">
                        <p className="text-[18px] text-[#ea9d4e] my-[25px]">{t('publishSetting')}</p>
                        <div className='mb-[20px]'>
                            <span className="text-[14px] mr-3">{t('permission')}</span>
                            <Radio.Group
                                onChange={(e) => setStateValue(e.target.value)}
                                value={stateValue}
                            >
                                <Radio value="public">
                                    <span className="text-[13px]">{t('public')}</span>
                                </Radio>
                                <Radio value="private">
                                    <span className="text-[13px]">{t('private')}</span>
                                </Radio>
                            </Radio.Group>
                        </div>
                        <div className='mb-[20px]'>
                            <span className="text-[14px] mr-3">{t('releaseTime')}</span>
                            <Radio.Group
                                onChange={(e) => setTimeValue(e.target.value)}
                                value={timeValue}
                            >
                                <Radio value="just">
                                    <span className="text-[13px]">{t('publishNow')}</span>
                                </Radio>
                                <Radio value="timeout">
                                    <span className="text-[13px]">{t('scheduled')}</span>
                                </Radio>
                            </Radio.Group>
                        </div>
                        <div className="mt-[20px]">
                            <Button
                                className={`${btnClass} bg-[blueviolet] h-[39px] w-[auto]`}
                                onClick={showModal}
                            >
                                {t('favoriteSettings')}
                            </Button>
                            <Button
                                loading={postLoading}
                                className={`${btnClass} bg-[blueviolet] h-[39px]`}
                                onClick={onSubmit}
                            >
                                {t('release')}
                            </Button>
                            <div
                                className={`${btnClass} bg-[#fff] text-[blueviolet] border border-[blueviolet]`}
                            >
                                {t('cancel')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
