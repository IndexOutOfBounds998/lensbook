import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { useUpIpfs } from "./useUpIpfs";
import { getAuthenticatedClient } from "../shared/getAuthenticatedClient";
import { useSignTypedData } from "wagmi";
import {
    useActiveProfile, appId, CollectPolicyType, ContentWarning,
    ReferencePolicyType, ContentFocus, ImageType
} from '@lens-protocol/react-web';
import { uuid } from "@walletconnect/legacy-utils";


export function usePost() {
    const { data: profile, error, loading: profileLoading } = useActiveProfile();

    const { signTypedDataAsync, isLoading: typedDataLoading } = useSignTypedData();

    const { execute, loading, url } = useUpIpfs({ type: 'upJsonContent' });

    const submit = async (postObj) => {

        let current_locale = i18n.language

        let mediaObject = {
            cover: "ipfs://" + postObj.image,
            item: "ipfs://" + postObj.image,
            type: ImageType.JPEG
        }

        const obj = {
            version: "1.0.0",
            metadata_id: uuid(),
            appId: "lenstrip",
            title: postObj.title,
            image: "ipfs://" + postObj.image,
            content: postObj.content,
            attributes: profile.attributes,
            state: postObj.state,
            locale: current_locale,
            mainContentFocus: "IMAGE",
            media: [mediaObject],
            tags: ["trip"],
            name: `Post by ${profile.handle}`,
            contentWarning: ContentWarning.NSFW,
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
        }
    }

    return { submit }
}
