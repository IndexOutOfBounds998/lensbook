import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useUpIpfs } from "../../hooks/useUpIpfs";
import { Upload, message } from 'antd';
import { useState } from 'react';
import { IPFS_API_KEY } from "../../constants/constant";

export default function UploadButton({ setIpfsHash }) {

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const { execute, loading: ipfsLoading, url } = useUpIpfs({ type: 'upLoadImg' });

    const beforeUpload = async (file) => {
        setLoading(true);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const url = await execute(formData);
        if (url) {
            const ipfsUrl = `https://ipfs.io/ipfs/${url}`;
            setIpfsHash(url);
            let img = new Image();
            img.src = url;
            img.onload = () => {
                setImageUrl(ipfsUrl);
                // if (setSize) setSize(img)
            }
            setLoading(false);
        }
        return isJpgOrPng;
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    return (
        <>
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                            width: '100%',
                        }}
                    />
                ) : (
                    uploadButton
                )}
            </Upload>
        </>
    )
}
