import {
    useActiveProfile,
    useActiveWallet,
} from '@lens-protocol/react-web';
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
// const { data: wallet, loading: walletLoading } = useActiveWallet();
// const { data: profile, error, loading: profileLoading } = useActiveProfile();
export function middleware(request: NextRequest) {
   
}
