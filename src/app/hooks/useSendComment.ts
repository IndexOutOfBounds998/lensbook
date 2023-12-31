import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { useUpIpfs } from "./useUpIpfs";
import { getAuthenticatedClient } from "../shared/getAuthenticatedClient";
import { useSignTypedData } from "wagmi";

import { uuid } from "@walletconnect/legacy-utils";
import { useState } from "react";

type commentData = {
  publication: any;
};

export function useSendComment({ publication }: commentData) {
  const { signTypedDataAsync, isLoading: typedDataLoading } =
    useSignTypedData();

  const { execute, url: hashUrl } = useUpIpfs({ type: "upJsonContent" });

  const [loading, setLoading] = useState(false);

  const submit = async (commentValue, profile) => {
    setLoading(true);
    const obj = {
      metadata_id: uuid(),
      appId: "lenstrip",
      version: "1.0.0",
      animatedUrl: null,
      content: commentValue,
      contentWarning: null,
      description: null,
      image: null,
      imageMimeType: null,
      locale: i18n.use(LanguageDetector).language,
      mainContentFocus: "TEXT_ONLY",
      media: [],
      tags: null,
      name: `Comment by ${profile.handle}`,
    };
    const hash = await execute(obj);
    if (hash) {
      // lensClient.explore.publications()
      const lensClient = await getAuthenticatedClient();
      const typedDataResult =
        await lensClient.publication.createCommentTypedData({
          profileId: profile.id,
          publicationId: publication.id,
          contentURI: "ipfs://" + hash, // or arweave
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
        primaryType: "CommentWithSig",
        domain: data.typedData.domain,
        message: data.typedData.value,
        types: data.typedData.types,
        value: data.typedData.value,
      });
      // broadcast
      const broadcastResult = await lensClient.transaction.broadcast({
        id: data.id,
        signature: signTypedData,
      });

      // broadcastResult is a Result object
      const broadcastResultValue = broadcastResult.unwrap();

      if (broadcastResultValue.__typename == "RelayerResult") {
      }

      setLoading(false);
    }
  };

  return { submit, loading };
}
