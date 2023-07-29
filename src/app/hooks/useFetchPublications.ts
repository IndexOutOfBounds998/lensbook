import { useState, useEffect } from "react";
import { ExplorePublicationRequest } from "@lens-protocol/client";
import { getAuthenticatedClient } from "../shared/getAuthenticatedClient";

type useFetchPublicationsArgs = {
  explorePublicationRequest: ExplorePublicationRequest;
};

export function useFetchPublications({
  explorePublicationRequest,
}: useFetchPublicationsArgs) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [data, setData] = useState([]);
  const [nextCursor, setNextCursor] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [request, setRequest] = useState(undefined);

  const execute = async () => {
    setFirstLoading(true);
    setRequest(explorePublicationRequest);
    fetchData(
      setLoading,
      explorePublicationRequest,
      setData,
      setNextCursor,
      setHasMore,
    );
    setFirstLoading(false);
  };

  useEffect(() => {
    if (!loaded) {
      execute();
      setLoaded(true);
    }
  }, [firstLoading]);

  const next = async () => {
    setLoading(true);
    const lensClient = await getAuthenticatedClient();
    request.cursor = nextCursor;
    let res = await lensClient.explore.publications(request);
    setLoading(false);
    setData((prevData) => [...prevData, ...res.items]);
    setNextCursor(res.pageInfo.next);
    setHasMore(res.items.length > 0);
  };

  const reset = async () => {
    setData([]);
    execute();
  };

  async function fetchData(
    setLoading,
    request: ExplorePublicationRequest,
    setData,
    setNextCursor,
    setHasMore,
  ) {
    setLoading(true);
    const lensClient = await getAuthenticatedClient();
    let res = await lensClient.explore.publications(request);
    setLoading(false);
    setData((prevData) => [...prevData, ...res.items]);
    setNextCursor(res.pageInfo.next);
    setHasMore(res.items.length > 0);
  }

  const changeFilter = async (requestNew: ExplorePublicationRequest) => {
    setRequest(requestNew);
    setData([]);
    fetchData(setLoading, requestNew, setData, setNextCursor, setHasMore);
  };

  return {
    next,
    reset,
    changeFilter,
    hasMore,
    data,
    loading,
    firstLoading,
  };
}
