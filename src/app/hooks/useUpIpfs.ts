import ipfsApi from "../api/ipfsApi";//{ upJsonContent, upLoadImg }
import { IPFS_API_KEY } from "../constants/constant";

type useUpData = {
    type: string; //upJsonContent or upLoadImg
    data: any;
};

export async function useUpIpfs({type, data}: useUpData) {
    const config = {
        headers: {
            Authorization: `Bearer ${IPFS_API_KEY}`
        }
    };
    const res = await ipfsApi[type](data, config);
    if (res && res.IpfsHash) {
        return "ipfs://" + res.IpfsHash;
    }
    return false;

}
