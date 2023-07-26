import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const MuUploadImagButton: React.FC<{
    fileList: UploadFile[];
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}> = ({ fileList, setFileList }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file: newFile }) => {

        if (newFile.type.indexOf('video') < 0) {
            setFileList(newFileList);
        }

    }

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/webp';
        if (!isJpgOrPng) {
            message.error('You can only upload image file!');
        }
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
            message.error('Image must smaller than 20MB!');
        }
        return isJpgOrPng && isLt20M;
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <>
            <ImgCrop rotationSlider>
                <Upload
                    action="/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
            </ImgCrop>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default MuUploadImagButton;