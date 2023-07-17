"use client";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ReactQuill.css';
import UploadButton from "../../components/UploadButton/UploadButton";
import { Radio, Input, Button, message, Modal, Switch } from 'antd';
import React, { useEffect, useRef, useState } from "react";
import { upJsonContent } from "../../api/ipfsApi";
import { IPFS_API_KEY } from "../../constants/constant";
import { useTranslation } from "react-i18next";
import {getAuthenticatedClient} from "../../shared/getAuthenticatedClient";
import {useSignTypedData} from "wagmi";
import {useActiveProfile, useCreatePost} from '@lens-protocol/react-web';
import {uuid} from "@walletconnect/legacy-utils";
export default function Strategy() {
    const [sumbitButtonLoading, setSumbitButtonLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const { t } = useTranslation();


    const btnClass =
        "w-[80px] inline-block mr-[80px] text-center font-bold text-[#fff] rounded p-2 cursor-pointer";

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ color: [] }, { background: [] }],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "color",
        "background",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

    let [radioValue, setRadioValue] = useState(0);
    let [radioGroup, setRadioGroup] = useState([]);
    let [isModalOpen, setIsModalOpen] = useState(false);
    let [stateValue, setStateValue] = useState('public');
    let [collectData, setCollectData] = useState();

    let [ipfsHash, setIpfsHash] = useState('');

    let quillRef = useRef();
    let titleRef = useRef();

    const loadCategory = async () => {
        setRadioGroup([
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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const upIpfs = async (data) => {
        const config = {
            headers: {
                Authorization: `Bearer ${IPFS_API_KEY}`
            }
        };
        const res = await upJsonContent(data, config)
        if (res && res.data) {
            return res.data.IpfsHash;
        }
        return false;
    }

    const { signTypedDataAsync, isLoading: typedDataLoading } = useSignTypedData();
    const { data: profile, error, loading: profileLoading } = useActiveProfile();
    const onSubmit = async () => {
        const obj = {
            metadata_id: uuid(),
            appId: "lenstrip",
            title: titleRef.current.input.value,
            image: "ipfs://" + ipfsHash,
            content: quillRef.current.value,
            attributes: profile.attributes,
            state: stateValue,
            description: quillRef.current.value,
            locale: "en-us",
            mainContentFocus: "IMAGE",
            name: `Post by ${profile.handle}`,
        };
        debugger
        const contentURI = upIpfs(obj);
        if (contentURI) {
            const lensClient = await getAuthenticatedClient();
            const typedDataResult = await lensClient.publication.createPostTypedData({
                profileId: profile.id,
                contentURI: "ipfs://" + contentURI, // or arweave
                collectModule: {
                    revertCollectModule: true, // collect disabled
                },
                referenceModule: {
                    followerOnlyReferenceModule: false, // anybody can comment or mirror
                },
            });
            // typedDataResult is a Result object
            const data = typedDataResult.unwrap();
            // sign with the wallet
            const signTypedData = await signTypedDataAsync({
                primaryType: 'PostWithSig',
                domain: (data.typedData.domain),
                message: data.typedData.value,
                types: (data.typedData.types),
                value: (data.typedData.value)
            });
            // broadcast
            const broadcastResult = await lensClient.transaction.broadcast({
                id: data.id,
                signature: signTypedData,
            });

            // broadcastResult is a Result object
            const broadcastResultValue = broadcastResult.unwrap();

            if (broadcastResultValue.__typename=="RelayerResult") {
                console.log(
                    `Transaction was successfuly broadcasted with txId ${broadcastResultValue.txId}`
                );
            }
        }
    };

    return (
        <>
            {contextHolder}
            <div className="w-full h-full bg-white overflow-y-scroll p-[30px] pl-[30px]">
                <div className="text-[20px] flex items-center">
                    <div className="w-[10px] h-[25px] inline-block bg-[blueviolet] rounded-3xl mr-1" />
                    <span>旅游攻略</span>
                </div>
                <div className="p-[20px]">
                    <div className="mb-[10px]">
                        <p className="mb-[10px]">封面图片</p>
                        <UploadButton setIpfsHash={setIpfsHash} />
                    </div>
                    <div className="mb-[16px]">
                        <Radio.Group
                            className="mb-[16px]"
                            value={radioValue}
                            onChange={(e) => setRadioValue(e.target.value)}
                        >
                            {radioGroup.map((item) => (
                                <Radio.Button key={item.key} value={item.key}>
                                    {item.option}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                        <Input
                            ref={titleRef}
                            showCount
                            maxLength={100}
                            className="mb-[16px]"
                            placeholder="填写产品标题"
                        />
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            modules={modules}
                            formats={formats}
                        />
                    </div>
                    <div className="text-[13px]">
                        <p className="text-[18px] text-[#ea9d4e] mb-[10px]">发布设置</p>
                        <div>
                            <span className="text-[14px] mr-3">权限设置</span>
                            <Radio.Group
                                onChange={(e) => setStateValue(e.target.value)}
                                value={stateValue}
                            >
                                <Radio value="public">
                                    <span className="text-[13px]">公开（所有人可见）</span>
                                </Radio>
                                <Radio value="private">
                                    <span className="text-[13px]">私有（仅自己可见）</span>
                                </Radio>
                            </Radio.Group>
                        </div>
                        <div className="mt-[20px]">
                            <Button
                                className={`${btnClass} bg-[blueviolet] h-[39px]`}
                                onClick={showModal}
                            >
                                收藏设置
                            </Button>
                            <Button
                                loading={sumbitButtonLoading}
                                className={`${btnClass} bg-[blueviolet] h-[39px]`}
                                onClick={onSubmit}
                            >
                                发 布
                            </Button>
                            <div
                                className={`${btnClass} bg-[#fff] text-[blueviolet] border border-[blueviolet]`}
                            >
                                取 消
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
