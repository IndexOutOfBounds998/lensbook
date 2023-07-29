import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAuthenticatedClient } from "@/app/shared/getAuthenticatedClient";
import { MAIN_NETWORK } from "@/app/constants/constant";
import { NftFragment } from "@lens-protocol/client";
import { polygonMumbai, polygon } from "wagmi/chains";

import { List } from "antd";

type ProfileNftProps = {
  address: string;
};

export default function ProfileNft({ address }: ProfileNftProps) {
  const { t } = useTranslation();

  const [data, setData] = useState<NftFragment[]>([]);

  const fetchNft = async (offset: number, address: string) => {
    let lensClient = await getAuthenticatedClient();
    const result = await lensClient.nfts.fetch({
      chainIds: [MAIN_NETWORK ? polygon.id : polygonMumbai.id],
      ownerAddress: address,
      limit: 10,
      cursor: JSON.stringify({
        timestamp: 1,
        offset: offset,
      }),
    });
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetchNft(10, address);
      if (res.items.length == 0) {
        //has no more
      }
      setData(res.items);
    };
    fetchData();
  }, [address]);

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta title={item.name} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
}
