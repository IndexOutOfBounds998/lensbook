import { useState, useEffect, useRef } from "react";
import { Trending } from "../api/LensApi";
type useTrendingArgs = {
  limit: Number;
};
export function useTrending({ limit }: useTrendingArgs) {
  const query =
    `{
    "operationName":"Trending",
    "variables":{
        "request":{
            "limit":` +
    limit +
    `,
            "sort":"MOST_POPULAR"
        }
    },
    "query":"query Trending($request: AllPublicationsTagsRequest!) {\\n  allPublicationsTags(request: $request) {\\n    items {\\n      tag\\n      total\\n      __typename\\n    }\\n    __typename\\n  }\\n}"
  }`;

  const config = {
    headers: {
      "content-type": "application/json",
      "X-Access-Token":
        typeof window !== "undefined" &&
        window.localStorage.getItem("accessToken")
          ? "Bearer " + window.localStorage.getItem("accessToken")
          : "",
    },
  };

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);

  const execute = async () => {
    setLoading(true);
    const result = await Trending(query, config);
    let items = result.data.allPublicationsTags.items;
    if (items) {
      items.unshift({
        tag: "All",
        total: 0,
        __typename: "TagResult",
      });
      setData(items);
    }
    setLoading(false);
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
