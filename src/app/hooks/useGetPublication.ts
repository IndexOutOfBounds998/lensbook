import { useState, useEffect, useRef } from 'react';
import { PublicationQueryRequest } from '@lens-protocol/client';
import { getAuthenticatedClient } from '../shared/getAuthenticatedClient';
 
type useGetPublicationArgs = {
  publicationQueryRequest: PublicationQueryRequest;
};


export function useGetPublication({
  publicationQueryRequest,
}: useGetPublicationArgs) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [load, setLoad] = useState(false);
  
  const execute = async () => {
    setLoading(false);
    const lensClient = await getAuthenticatedClient();
    const result = await lensClient.publication.fetch(publicationQueryRequest);
    setData(result);
    setLoading(true);
  };

  useEffect(() => {
    if (!load) {
      execute();
      setLoad(true);
    }
  }, [load]);



  return {
    data,
    loading,
  };
}
