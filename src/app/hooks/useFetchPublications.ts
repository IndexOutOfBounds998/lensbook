import { useState, useEffect,useRef } from 'react';
import { ExplorePublicationRequest } from '@lens-protocol/client';
import { getAuthenticatedClient } from '../shared/getAuthenticatedClient';
import { isEqual } from 'lodash';
type useFetchPublicationsArgs = {
  explorePublicationRequest: ExplorePublicationRequest;
};

// 使用方式
// const explorePublicationRequest = {
//     cursor: JSON.stringify({
//       timestamp: 1,
//       offset: 20,
//       filter: JSON.stringify({
//         mainContentFocus: ['IMAGE']
//       })
//     }),
//     sortCriteria: PublicationSortCriteria.Latest,
//     limit: 20,
//     publicationTypes: [PublicationTypes.Post],
//     sources: ['lenster', 'lenstrip']
//   };
  
//   const { data, loading, hasMore, next ,reset} = useFetchPublications({
//     explorePublicationRequest
//   });

export function useFetchPublications({
  explorePublicationRequest,
}: useFetchPublicationsArgs) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [nextCursor, setNextCursor] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [request, setRequest] = useState(undefined);
  const prevExplorePublicationRequest = useRef<ExplorePublicationRequest>();

  const execute = async () => {
    setRequest(explorePublicationRequest);
    setLoading(true);
    const lensClient = await getAuthenticatedClient();
    let res = await lensClient.explore.publications(explorePublicationRequest);
    setLoading(false);
    setData(prevData => [...prevData, ...res.items]);
    setNextCursor(res.pageInfo.next);
    setHasMore(res.items.length > 0);
  };

  useEffect(() => {
    if (
      !prevExplorePublicationRequest.current ||
      !isEqual(
        prevExplorePublicationRequest.current,
        explorePublicationRequest
      )
    ) {
      execute();
    }

    prevExplorePublicationRequest.current = explorePublicationRequest;
  }, [explorePublicationRequest]);

  const next = async () => {
    setLoading(true);
    const lensClient = await getAuthenticatedClient();
    request.cursor = nextCursor;
    let res = await lensClient.explore.publications(request);
    setLoading(false);
    setData(prevData => [...prevData, ...res.items]);
    setNextCursor(res.pageInfo.next);
    setHasMore(res.items.length > 0);
  };

  const reset = async () => {
    setData([]);
    execute();
  };

  return {
    next,
    reset,
    hasMore,
    data,
    loading,
  };
}
