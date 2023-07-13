import { LensClient, development } from "@lens-protocol/client";
import { Wallet } from "ethers";


export async function getAuthenticatedClient(): Promise<LensClient> {

  const lensClient = new LensClient({
    environment: development,
    storage:localStorage
  });

  return lensClient;
}