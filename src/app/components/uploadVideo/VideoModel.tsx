"use client";
import { Radio, Input, Button, Upload, message } from 'antd';
import React, { useRef, useState } from "react";
import { usePost } from '../../hooks/usePost'
import { useTranslation } from "react-i18next";
import {
    useActiveProfile
} from '@lens-protocol/react-web';
const { TextArea } = Input;
import ReactPlayer from "react-player";
import { RcFile, UploadProps } from "antd/es/upload";
import i18n from "i18next";
import { uuid } from "@walletconnect/legacy-utils";
import { PublicationMetadataV2Input, PublicationMainFocus, PublicationMetadataDisplayTypes } from "@lens-protocol/client";
import { useUpIpfs } from "../../hooks/useUpIpfs";
import { getAuthenticatedClient } from "@/app/shared/getAuthenticatedClient";
import CollectModel from "../collectSetting/CollectModel";
import { CollectModuleParams, ReferenceModuleParams } from '@lens-protocol/client';
import { getTimeAddedNDay } from '@/app/utils/utils';
const VideoModel: React.FC<{
    videoData: any;
}> = ({ videoData }) => {

    const { t } = useTranslation();

    const btnClass =
        "w-[80px] inline-block mr-[80px] text-center font-bold text-[#fff] rounded p-2 cursor-pointer";

    let [isModalOpen, setIsModalOpen] = useState(false);
    let [stateValue, setStateValue] = useState('public');
    let [timeValue, setTimeValue] = useState('just');
    let [quillRef, setQuillRef] = useState();
    let [cover, setCover] = useState('');
    let [collectData, setCollectData] = useState({
        isCollect: false,
        isCost: false,
        isReward: false,
        isLimit: false,
        isTimeLimit: false,
        followerOnly: false,
        currencys: [],
        amount: 0,
        selectAddress: '',
        referralFee: 0,
        collectLimit: 0,
        isSave: false
    });

    let titleRef = useRef(undefined);

    const { data: profile, error, loading: profileLoading } = useActiveProfile();

    const props: UploadProps = {
        name: 'file',
        action: '/api/upload',
        showUploadList: false,
        beforeUpload(file, FileList) {
            beforeUpload(file);
        },
    };

    const showModal = () => {
        setIsModalOpen(true);
    };


    const callbackOnSuccess = () => {
        message.success(t('success'))
    }
    const callbackOnError = (error) => {
        message.error(t('error') + error)
    }

    const { execute, loading: ipfsLoading, url } = useUpIpfs({ type: 'upLoadImg' });
    const beforeUpload = async (file: RcFile) => {
        const formData = new FormData();
        formData.append('file', file);
        const url = await execute(formData);
        if (url) {
            setCover(url);
        }
    };

    const { submit: post, postLoading } = usePost(callbackOnSuccess, callbackOnError);

    const onSubmit = async () => {
        if (!titleRef.current || !quillRef) {
            message.warning(t('contentFillIn'));
            return
        }

        const lensClient = await getAuthenticatedClient();
        const result = await lensClient.publication.createAttachMediaData({
            itemCid: videoData.cid,
            type: videoData.type,
            altTag: titleRef.current.input.value,
            cover: "ipfs://" + cover,
        });


        if (!result) {
            return;
        }

        let current_locale = i18n.language

        let matedata: PublicationMetadataV2Input = {
            version: "2.0.0",
            metadata_id: uuid(),
            appId: "lenstrip",
            image: "ipfs://" + cover,
            content: quillRef,
            title: titleRef.current.input.value,
            attributes: [
                {
                    displayType: PublicationMetadataDisplayTypes.Number,
                    traitType: "size",
                    value: videoData.size
                }
            ],
            locale: current_locale,
            mainContentFocus: PublicationMainFocus.Video,
            media: [result.media],
            tags: ["trip"],
            name: `Post by ${profile.handle}`
        }

        let collectModule: CollectModuleParams;

        let referenceModule: ReferenceModuleParams = {
            followerOnlyReferenceModule: false
        }
        //构建 收藏模块 和 转发模块 
        if (collectData.isCollect) {
            collectModule = {
                simpleCollectModule: {
                    followerOnly: collectData.followerOnly
                }
            }
            if (collectData.isCost) {
                collectModule.simpleCollectModule.fee = {
                    amount: {
                        currency: collectData.selectAddress,
                        value: collectData.amount ? collectData.amount + '' : '0',

                    },
                    recipient: profile.ownedBy,
                    referralFee: parseFloat(collectData.referralFee + '')

                }
            }
            if (collectData.isLimit) {
                collectModule.simpleCollectModule.collectLimit = collectData.collectLimit + '';
            }
            if (collectData.isTimeLimit) {
                collectModule.simpleCollectModule.endTimestamp = collectData.isTimeLimit ? getTimeAddedNDay(1) : '0';
            }
            if(collectData.followerOnly){
                collectModule.simpleCollectModule.  followerOnly= collectData.followerOnly;
            }


        } else {
            collectModule = {
                revertCollectModule: true
            }
        }

        post(matedata, collectModule, referenceModule);
    };

    return (
        <div>
            <div className="w-full h-full bg-white p-[30px] pl-[30px]">
                <div className="text-[20px] flex items-center">
                    <div className="w-[10px] h-[25px] inline-block bg-[blueviolet] rounded-3xl mr-1" />
                    <span>{t('postVideo')}</span>
                </div>
                <div className="p-[20px]">
                    <div className="mb-[10px]">
                        <div className="mb-[10px]">
                            <span className="mb-[10px] text-[18px]">{t('videoEditing')}</span>
                            <Upload
                                {...props}
                            >
                                <Button
                                    type="primary"
                                    size='small'
                                    className='bg-[blueviolet] ml-[15px]'
                                >
                                    设置封面
                                </Button>
                            </Upload>
                        </div>
                        <div className='w-[200px] h-[300px] border'>
                            <ReactPlayer
                                url={videoData.url}
                                controls
                                loop
                                light={cover ? <img src={`https://ipfs.io/ipfs/${cover}`} /> : false}
                                width='100%'
                                height='100%'
                            />
                        </div>
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
            <CollectModel show={isModalOpen} setShow={setIsModalOpen} setCollectData={setCollectData} />
        </div>
    );
}
export default VideoModel;
