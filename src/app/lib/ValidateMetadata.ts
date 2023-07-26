import { getAuthenticatedClient } from "../shared/getAuthenticatedClient";
import { PublicationMetadataV2Input } from "@lens-protocol/client";
export default async function ValidateMetadata(metadata: PublicationMetadataV2Input) {
    const lensClient = await getAuthenticatedClient();
    const validateResult = await lensClient.publication.validateMetadata(metadata);

    if (!validateResult.valid) {
        throw new Error(`Metadata is not valid.`);
    }

}