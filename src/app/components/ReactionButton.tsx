import {

    ContentPublication,
    ReactionType,

    useReaction,

    ProfileId,

} from '@lens-protocol/react-web';

import { Button } from 'antd';

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

    const hasAnyReaction = publication.reaction !== null;

    const toggleReaction = async () => {
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
    };

    return (
        <>
            <Button onClick={toggleReaction} disabled={isPending || (hasAnyReaction && !hasReactionType)}>
                <strong>{hasReactionType ? `取消点赞` : `点赞`}</strong>
            </Button>
        </>
    );
}

