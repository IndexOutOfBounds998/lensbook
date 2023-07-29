"use strict";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { message, Upload } from "antd";
import { useUpIpfs } from "../../hooks/useUpIpfs";
import { useRouter } from "next/navigation";
import * as Hash from "typestub-ipfs-only-hash";
const { Dragger } = Upload;
import { Buffer } from "buffer";
import { UploadProps } from "antd/es/upload";
import VideoModel from "./VideoModel";

export default function UploadVideo() {
  const router = useRouter();

  const { t } = useTranslation();

  const items = [
    {
      title: t("videoSize"),
      p1: t("videoTime"),
      p2: t("videoLoad"),
    },
    {
      title: t("videoFormat"),
      p1: t("videoCommon"),
      p2: t("videoRecommend"),
    },
    {
      title: t("videoRatio"),
      p1: t("ratioRecommend"),
      p2: t("videoWeb"),
    },
  ];
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState({});
  const [showModel, setShowModel] = useState(false);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "/api/upload",
    beforeUpload(file) {
      beforeUpload(file);
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        
      }
      if (status === "done") {
        setShowModel(true);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      
    },
  };

  const readAsArrayBufferReader = (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject("Unknown error occurred during reading the file");
      };

      reader.onload = () => {
        
        resolve(reader.result);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  function getObjectURL(file) {
    let url = null;
    if (window.createObjectURL != undefined) {
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }

  const beforeUpload = async (file) => {
    if (file.type.indexOf("video/") === -1) {
      message.error("You can only upload video file!");
      return file.type;
    }
    const isLt10GB = file.size / 1024 / 1024 / 1024 < 10;
    if (!isLt10GB) {
      message.error("Image must smaller than 10GB!");
      return isLt10GB;
    }
    readAsArrayBufferReader(file).then(async (buff) => {
      const buf = Buffer.from(buff);
      const cid = await Hash.of(buf);
      setVideoData({
        url: getObjectURL(file),
        cid: cid,
        type: file.type,
      });
      
      // const lensClient = await getAuthenticatedClient();
      // const result = await lensClient.publication.createAttachMediaData({
      //     itemCid: cid,
      //     type: "video/mp4",
      //     altTag: "video test",
      // });
    });

    // setLoading(true);
    // const formData = new FormData();
    // formData.append('file', file);
    // const url = await execute(formData);
    // if (url) {
    //     const ipfsUrl = `https://ipfs.io/ipfs/${url}`;
    //     setLoading(false);
    //     router.push(`/publish/video?ipfsUrl=${ipfsUrl}`)
    // }
  };

  return (
    <>
      {!showModel ? (
        <div className="w-full">
          <Dragger {...props}>
            <div className="py-[100px]">
              <p>
                <i className="iconfont icon-upload text-[40px]" />
              </p>
              <p className="">{t("videoUpload")}</p>
              <div className="mt-[20px]">
                <span className="bg-[blueviolet] mx-[auto] py-[8px] px-[15px] rounded-[5px] text-[#fff]">
                  {t("uploadVideo")}
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
        <VideoModel videoData={videoData} />
      )}
    </>
  );
}
