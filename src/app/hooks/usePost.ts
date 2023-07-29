import { useUpIpfs } from "./useUpIpfs";
import { getAuthenticatedClient } from "../shared/getAuthenticatedClient";
import { useSignTypedData } from "wagmi";
import { useActiveProfile } from "@lens-protocol/react-web";
import { useState } from "react";
export function usePost(callbackOnSuccess, callbackOnError) {
  const { data: profile, error, loading: profileLoading } = useActiveProfile();

  const { signTypedDataAsync, isLoading: typedDataLoading } =
    useSignTypedData();

  const { execute, loading, url } = useUpIpfs({ type: "upJsonContent" });

  const [postLoading, setPostLoading] = useState(false);

  // collectModule: {
  //     revertCollectModule: true, // collect disabled
  // },
  // referenceModule: {
  //     followerOnlyReferenceModule: false, // anybody can comment or mirror
  // },
  const submit = async (obj, collectModule, referenceModule) => {
    setPostLoading(true);
    const url = await execute(obj);
    if (url) {
      // lensClient.explore.publications()
      try {
        const lensClient = await getAuthenticatedClient();
        const typedDataResult =
          await lensClient.publication.createPostTypedData({
            profileId: profile.id,
            contentURI: "ipfs://" + url, // or arweave
            collectModule: collectModule,
            referenceModule: referenceModule,
          });
        // typedDataResult is a Result object
        const data = typedDataResult.unwrap();
        // sign with the wallet
        const signTypedData = await signTypedDataAsync({
          primaryType: "PostWithSig",
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
          // 定义一个回调函数 又调用方执行
          callbackOnSuccess();
        } else {
          callbackOnError(broadcastResultValue.reason);
        }
      } catch (error) {
        callbackOnError(error);
        setPostLoading(false);
      }
    }
    setPostLoading(false);
  };

  return { submit, postLoading };
}
