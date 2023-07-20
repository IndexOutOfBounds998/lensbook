import { LensClient, development, production } from "@lens-protocol/client";
import { MAIN_NETWORK } from "@/app/constants/constant";

export async function getAuthenticatedClient(): Promise<LensClient> {
  const lensClient = new LensClient({
    environment: MAIN_NETWORK ? production : development,
    storage: localStorage,
  });
  
  return lensClient;
}
