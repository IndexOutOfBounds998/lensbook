import i18n from "i18next";
import { useUpIpfs } from "./useUpIpfs";
import { getAuthenticatedClient } from "../shared/getAuthenticatedClient";
import { useSignTypedData } from "wagmi";
import {
    useActiveProfile, appId, CollectPolicyType, ContentWarning,
    ReferencePolicyType, ContentFocus, ImageType
} from '@lens-protocol/react-web';
import { uuid } from "@walletconnect/legacy-utils";
import { useState } from "react";

export function usePost() {
    const { data: profile, error, loading: profileLoading } = useActiveProfile();

    const { signTypedDataAsync, isLoading: typedDataLoading } = useSignTypedData();

    const { execute, loading: uploadLoading, url } = useUpIpfs({ type: 'upJsonContent' });

    const [loading, setLoading] = useState(false);

    const submit = async (postObj) => {

        setLoading(true);
        let current_locale = i18n.language

        let mediaObject = {
            cover: postObj.image,
            item: postObj.image,
            type: ImageType.JPEG
        }

        const obj = {
            version: "1.0.0",
            metadata_id: uuid(),
            appId: "lenstrip",
            title: postObj.title,
            image: postObj.image,
            content: postObj.content,
            attributes: profile.attributes,
            state: postObj.state,
            locale: current_locale,
            mainContentFocus: "IMAGE",
            media: [mediaObject],
            tags: ["trip"],
            name: `Post by ${profile.handle}`
        }
        const url = await execute(obj);
        if (url) {
            // lensClient.explore.publications()
            const lensClient = await getAuthenticatedClient();
            const typedDataResult = await lensClient.publication.createPostTypedData({
                profileId: profile.id,
                contentURI: url, // or arweave
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

            if (broadcastResultValue.__typename == "RelayerResult") {
                console.log(
                    `Transaction was successfuly broadcasted with txId ${broadcastResultValue.txId}`
                );
            }
            setLoading(false);
        }
    }

    return { submit, loading }
}
