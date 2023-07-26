import ipfsApi from "../api/ipfsApi";//{ upJsonContent, upLoadImg }
import { IPFS_API_KEY } from "../constants/constant";
import { useState } from 'react';
type useUpData = {
    type: string; //upJsonContent or upLoadImg
};

export function useUpIpfs({ type }: useUpData) {

    const [loading, setLoad] = useState(false);
    const [url, setUrl] = useState('');
    const config = {
        headers: {
            Authorization: `Bearer ${IPFS_API_KEY}`
        }
    };

    const execute = async (data: any) => {
        setLoad(true);
        const res = await ipfsApi[type](data, config);
        if (res && res.IpfsHash) {
            setUrl("ipfs://" + res.IpfsHash);
            setLoad(false);
            return res.IpfsHash;
        }
    }

    return {
        execute,
        loading,
        url
    };

}
