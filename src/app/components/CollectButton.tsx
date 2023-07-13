import {
    CollectState,
    Comment,
    Post,
    ProfileOwnedByMe,
} from '@lens-protocol/react-web';

import {Button, message} from 'antd';

import { useCollectWithSelfFundedFallback } from '@/app/hooks/useCollectWithSelfFundedFallback';
import {useEffect} from "react";


type CollectButtonProps = {
    collector: ProfileOwnedByMe;
    publication: Post | Comment;
};

export default function CollectButton({ collector, publication }: CollectButtonProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const {
        execute: collect,
        error,
        isPending,
    } = useCollectWithSelfFundedFallback({ collector, publication });
    const isCollected = publication.hasCollectedByMe;

    useEffect(() => {
        if (!isPending) {
            messageApi.open({
                type: 'success',
                content: '收藏成功',
            });
        }
    }, [isPending])

    const CollectBtn = ({title}) => (
        <Button
            type="link"
            ghost
            disabled
            className='flex items-center'
            title={title}
        >
            <i className={`iconfont icon-star cursor-pointer text-[25px] mr-3`} />
            <span className='font-bold'>{ publication.stats.totalAmountOfCollects }</span>
        </Button>
    )

    switch (publication.collectPolicy.state) {
        case CollectState.COLLECT_TIME_EXPIRED:
            return <CollectBtn title='Collecting ended'/>;
        case CollectState.COLLECT_LIMIT_REACHED:
            return <CollectBtn title='Collect limit reached'/>;
        case CollectState.NOT_A_FOLLOWER:
            return <CollectBtn title='Only followers can collect'/>;
        case CollectState.CANNOT_BE_COLLECTED:
            return <CollectBtn title='Cannot be collected'/>;
        case CollectState.CAN_BE_COLLECTED:
            return (
                <>
                    <Button
                        onClick={collect}
                        disabled={isCollected || isPending}
                        loading={isPending}
                        type="link"
                        ghost
                        icon={<i className={`iconfont icon-${isCollected ? 'star-fill' : 'star'} cursor-pointer text-[25px] mr-3`} />}
                        className='flex items-center'
                    >
                        <span className='font-bold'>{ publication.stats.totalAmountOfCollects }</span>
                    </Button>
                    {/*<Button onClick={collect} disabled={isCollected || isPending}>*/}
                    {/*    {error*/}
                    {/*        ? 'Error'*/}
                    {/*        : isPending*/}
                    {/*            ? 'Collecting...'*/}
                    {/*            : isCollected*/}
                    {/*                ? `You've already collected`*/}
                    {/*                : 'Collect'}*/}
                    {/*</Button>*/}

                </>
            );
    }
}


