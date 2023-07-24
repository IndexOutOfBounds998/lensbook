"use client";
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import '../../style/ReactQuill.css';
import UploadButton from "../../components/button/UploadButton";
import { Radio, Input, Button } from 'antd';
import React, { useEffect, useRef, useState } from "react";
import { usePost } from '../../hooks/usePost'
const { TextArea } = Input;
// @ts-ignore
export default function Strategy() {
    const [sumbitButtonLoading, setSumbitButtonLoading] = useState(false);

    const btnClass =
        "w-[80px] inline-block mr-[80px] text-center font-bold text-[#fff] rounded p-2 cursor-pointer";

    let [isModalOpen, setIsModalOpen] = useState(false);
    let [stateValue, setStateValue] = useState('public');
    let [timeValue, setTimeValue] = useState('just');
    let [quillRef, setQuillRef] = useState();

    let [ipfsHash, setIpfsHash] = useState('');

    // let quillRef = useRef(undefined);
    let titleRef = useRef(undefined);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const { submit: post } = usePost();
    const onSubmit = async () => {
        if (titleRef.current && quillRef) {
            const obj = {
                title: titleRef.current.input.value,
                image: ipfsHash,
                content: quillRef,
                state: stateValue,
                description: quillRef,
            };
            post(obj);
        }

    };

    return (
        <div>
            <div className="w-full h-full bg-white overflow-y-scroll p-[30px] pl-[30px]">
                <div className="text-[20px] flex items-center">
                    <div className="w-[10px] h-[25px] inline-block bg-[blueviolet] rounded-3xl mr-1" />
                    <span>发布图文</span>
                </div>
                <div className="p-[20px]">
                    <div className="mb-[10px]">
                        <p className="mb-[10px] text-[18px]">图片编辑&nbsp;&nbsp;<span className="text-[14px] text-[blue]">+上传更多</span></p>
                        <UploadButton setIpfsHash={setIpfsHash} />
                    </div>
                    <div className="mb-[16px]">
                        <Input
                            ref={titleRef}
                            showCount
                            maxLength={20}
                            className="mb-[16px]"
                            placeholder="填写产品标题"
                        />
                        <TextArea
                            value={quillRef}
                            onChange={(e) => setQuillRef(e.target.value)}
                            placeholder="Controlled autosize"
                            maxLength={1000}
                            showCount
                            autoSize={{
                                minRows: 4,
                            }}
                        />
                    </div>
                    <div className='flex justify-between w-[250px]'>
                        <Button className='px-[15px] py-[0] flex items-center'><span className=''># &nbsp;</span> 话题</Button>
                        <Button className='px-[15px] py-[0] flex items-center'><span className=''>@ &nbsp;</span> 用户</Button>
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
                            />&nbsp;表情
                        </Button>
                    </div>
                    <div className="text-[13px]">
                        <p className="text-[18px] text-[#ea9d4e] my-[25px]">发布设置</p>
                        <div className='w-[500px] flex items-center mb-[20px]'>
                            <span className="w-[60px] text-[14px] mr-3">添加地点</span>
                            <div  className='w-[440px]'>
                                <Input
                                    className=""
                                    placeholder="请选择"
                                />
                            </div>
                        </div>
                        <div className='mb-[20px]'>
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
                        <div className='mb-[20px]'>
                            <span className="text-[14px] mr-3">发布时间</span>
                            <Radio.Group
                                onChange={(e) => setTimeValue(e.target.value)}
                                value={timeValue}
                            >
                                <Radio value="just">
                                    <span className="text-[13px]">立即发布</span>
                                </Radio>
                                <Radio value="timeout">
                                    <span className="text-[13px]">定时发布</span>
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
        </div>
    );
}
