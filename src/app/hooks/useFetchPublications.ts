
import { useState } from 'react';
import { ExplorePublicationRequest } from '@lens-protocol/client';
import { getAuthenticatedClient } from '../shared/getAuthenticatedClient';
type useFetchPublicationsArgs = {
    explorePublicationRequest: ExplorePublicationRequest;
};

export function useFetchPublications({
    explorePublicationRequest
}: useFetchPublicationsArgs) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [nextCursor, setNextCursor] = useState('');
    const [hasmore, setHasmore] = useState(false);
    const [request, setRequest] = useState(undefined);


    const execute = async () => {
        setRequest(explorePublicationRequest);
        setLoading(true);
        const lensClient = await getAuthenticatedClient();
        let res =await lensClient.explore.publications(explorePublicationRequest);
        setLoading(false);
        debugger
        setData(prevData => [...prevData, ...res.data]);
        setNextCursor(res.next)
        if(res.data.length==0){
            setHasmore(false);
        }else{
            setHasmore(true);
        }
    };

    const next = async () => {
        setLoading(true);
        const lensClient = await getAuthenticatedClient();
        request.cursor=nextCursor;
        let res =await lensClient.explore.publications(request);
        setLoading(false);
        setData(prevData => [...prevData, ...res.data]);
        setNextCursor(res.next)
    };

    const reset = async () => {
        setData([]);
    };

    return {
        execute,
        next,
        reset,
        hasmore,
        data,
        loading
    };
}