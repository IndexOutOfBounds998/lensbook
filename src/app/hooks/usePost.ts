import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { useUpIpfs } from "./useUpIpfs";
import { getAuthenticatedClient } from "../shared/getAuthenticatedClient";
import {useSignTypedData} from "wagmi";
import { useActiveProfile } from '@lens-protocol/react-web';
import {uuid} from "@walletconnect/legacy-utils";

export function usePost() {
    const {data: profile, error, loading: profileLoading} = useActiveProfile();

    const {signTypedDataAsync, isLoading: typedDataLoading} = useSignTypedData();

    const submit = async (postObj) => {

        const obj = {
            metadata_id: uuid(),
            appId: "lenstrip",
            version: "1.0.0",
            title: postObj.title,
            image: "ipfs://" + postObj.image,
            content: postObj.content,
            attributes: profile.attributes,
            state: postObj.state,
            locale: "en-us",
            mainContentFocus: "IMAGE",
            name: `Post by ${profile.handle}`,
        }
        const contentURI = await useUpIpfs({type: 'upJsonContent', data: obj});
        if (contentURI) {
            // lensClient.explore.publications()
            const lensClient = await getAuthenticatedClient();
            const typedDataResult = await lensClient.publication.createPostTypedData({
                profileId: profile.id,
                contentURI: contentURI, // or arweave
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

    return {submit}
}
