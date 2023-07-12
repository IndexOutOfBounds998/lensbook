import {

    ContentPublication,
    ReactionType,

    useReaction,

    ProfileId,

} from '@lens-protocol/react-web';

import {Button, message} from 'antd';
import {useState} from "react";
import './style/ReactionButton.css'

type ReactionButtonProps = {
    publication: ContentPublication;
    profileId: ProfileId;
    reactionType: ReactionType;
};

export default function ReactionButton({ publication, profileId, reactionType }: ReactionButtonProps) {

    const { addReaction, removeReaction, hasReaction, isPending } = useReaction({
        profileId,
    });

    const hasReactionType = hasReaction({
        reactionType,
        publication,
    });

    let [loading, setLoading] = useState(false);

    const hasAnyReaction = publication.reaction !== null;

    const toggleReaction = async () => {
        setLoading(true)
        if (hasReactionType) {
            await removeReaction({
                reactionType,
                publication,
            });
        } else {
            await addReaction({
                reactionType,
                publication,
            });
        }
        setLoading(false)
    };

    return (
        <>
            <Button
                onClick={toggleReaction}
                type="link"
                loading={loading}
                title={hasReactionType ? `取消点赞` : `点赞`}
                ghost
                disabled={isPending || (hasAnyReaction && !hasReactionType)}
                icon={<i className={`iconfont icon-${hasReactionType ? 'heart-fill' : 'heart'} cursor-pointer text-[25px] mr-3`} />}
                className='reaction-btn flex items-center p-[0] h-[auto] text-[#ff2442]'
            >
                <span className='font-bold h-[25px]'>{ publication.stats.totalUpvotes }</span>
            </Button>
        </>
    );
}

