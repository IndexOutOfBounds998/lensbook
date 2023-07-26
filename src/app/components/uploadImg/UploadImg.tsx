import React, { useEffect, useRef, useState } from "react";
import {useTranslation} from "react-i18next";
import {message, Upload} from "antd";
import { useRouter } from 'next/navigation'
import {useUpIpfs} from "../../hooks/useUpIpfs";

const { Dragger } = Upload;

export default function UploadVideo() {

    const router = useRouter();

    const { t } = useTranslation();

    const items = [
        {
            title: t('imgSize'),
            p1: t('imgTime'),
            p2: t('imgLoad'),
        },
        {
            title: t('imgFormat'),
            p1: t('imgCommon'),
            p2: t('imgRecommend'),
        },
        {
            title: t('imgRatio'),
            p1: t('imgRatioRecommend'),
            p2: t('imgWeb'),
        },
    ];

    const [loading, setLoading] = useState(false);

    const { execute, loading: ipfsLoading, url } = useUpIpfs({ type: 'upLoadImg' });

    const beforeUpload = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        const url = await execute(formData);
        if (url) {
            const ipfsUrl = `https://ipfs.io/ipfs/${url}`;
            setLoading(false);
            router.push(`/publish/strategy?ipfsUrl=${ipfsUrl}`)
        }
    };

    return (
        <div className='w-full'>
            <Dragger
                beforeUpload={beforeUpload}
            >
                <div className="py-[100px]">
                    <p>
                        <i className='iconfont icon-upload text-[40px]' />
                    </p>
                    <p className="">{ t('imgUpload') }</p>
                    <div className='mt-[20px]'>
                        <span className="bg-[blueviolet] mx-[auto] py-[8px] px-[15px] rounded-[5px] text-[#fff]">
                        { t('uploadImg') }
                    </span>
                    </div>
                </div>
            </Dragger>
            <div className='flex mt-[10px]'>
                {
                    items.map((item, index) => (
                        <div key={index} className='border h-[130px] flex-1 text-center pt-[30px] rounded-[4px]] even:mx-[10px]'>
                            <p>{ item.title }</p>
                            <p className='mt-[5px] text-[#8c8c8c] text-[12px]'>{ item.p1 }</p>
                            <p className='text-[#8c8c8c] text-[12px]'>{ item.p2 }</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}