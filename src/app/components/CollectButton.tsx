import {
    CollectState,
    Comment,
    Post,
    ProfileOwnedByMe,
} from '@lens-protocol/react-web';

import { Button } from 'antd';

import { useCollectWithSelfFundedFallback } from '@/app/hooks/useCollectWithSelfFundedFallback';


type CollectButtonProps = {
    collector: ProfileOwnedByMe;
    publication: Post | Comment;
};

export default function CollectButton({ collector, publication }: CollectButtonProps) {
    const {
        execute: collect,
        error,
        isPending,
    } = useCollectWithSelfFundedFallback({ collector, publication });
    const isCollected = publication.hasCollectedByMe;

    switch (publication.collectPolicy.state) {
        case CollectState.COLLECT_TIME_EXPIRED:
            return <Button disabled={true}>Collecting ended</Button>;
        case CollectState.COLLECT_LIMIT_REACHED:
            return <Button disabled={true}>Collect limit reached</Button>;
        case CollectState.NOT_A_FOLLOWER:
            return <Button disabled={true}>Only followers can collect</Button>;
        case CollectState.CANNOT_BE_COLLECTED:
            return <Button disabled={true}>Cannot be collected</Button>;
        case CollectState.CAN_BE_COLLECTED:
            return (
                <>
                <p>收藏个数{publication.stats.totalAmountOfCollects}</p>
                    <Button onClick={collect} disabled={isCollected || isPending}>
                        {error
                            ? 'Error'
                            : isPending
                                ? 'Collecting...'
                                : isCollected
                                    ? `You've already collected`
                                    : 'Collect'}
                    </Button>

                </>
            );
    }
}


