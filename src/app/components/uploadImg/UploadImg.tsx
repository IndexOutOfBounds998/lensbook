import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload, message } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import ImageModel from "./ImageModel";

const { Dragger } = Upload;

export default function UploadImg() {
  const { t } = useTranslation();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [showModel, setShowModel] = useState(false);

  const items = [
    {
      title: t("imgSize"),
      p1: t("imgTime"),
      p2: t("imgLoad"),
    },
    {
      title: t("imgFormat"),
      p1: t("imgCommon"),
      p2: t("imgRecommend"),
    },
    {
      title: t("imgRatio"),
      p1: t("imgRatioRecommend"),
      p2: t("imgWeb"),
    },
  ];

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("You can only upload image file!");
    }
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error("Image must smaller than 20MB!");
    }
    return isJpgOrPng && isLt20M;
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "/api/upload",
    beforeUpload(file, FileList) {
      beforeUpload(file);
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setShowModel(true);
        setFileList(info.fileList);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <>
      {fileList.length === 0 && !showModel ? (
        <div className="w-full">
          <Dragger {...props}>
            <div className="py-[100px]">
              <p>
                <i className="iconfont icon-upload text-[40px]" />
              </p>
              <p className="">{t("imgUpload")}</p>
              <div className="mt-[20px]">
                <span className="bg-[blueviolet] mx-[auto] py-[8px] px-[15px] rounded-[5px] text-[#fff]">
                  {t("uploadImg")}
                </span>
              </div>
            </div>
          </Dragger>
          <div className="flex mt-[10px]">
            {items.map((item, index) => (
              <div
                key={index}
                className="border h-[130px] flex-1 text-center pt-[30px] rounded-[4px]] even:mx-[10px]"
              >
                <p>{item.title}</p>
                <p className="mt-[5px] text-[#8c8c8c] text-[12px]">{item.p1}</p>
                <p className="text-[#8c8c8c] text-[12px]">{item.p2}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ImageModel fileList={fileList} setFileList={setFileList}></ImageModel>
      )}
    </>
  );
}
