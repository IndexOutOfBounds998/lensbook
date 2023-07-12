import {
    Profile,
    ProfileOwnedByMe,
    useUnfollow,
} from '@lens-protocol/react-web';
import { message, Button } from "antd";
import { useFollowWithSelfFundedFallback } from '../hooks/useFollowWithSelfFundedFallback';
import { useTranslation } from "react-i18next";
type FollowButtonProps = {
    follower: ProfileOwnedByMe;
    followee: Profile;
};

export default function FollowButton({ followee, follower }: FollowButtonProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const { t } = useTranslation();
    const {
        execute: follow,
        error: followError,
        isPending: isFollowPending,
    } = useFollowWithSelfFundedFallback({
        followee,
        follower,
    });

    const {
        execute: unfollow,
        error: unfollowError,
        isPending: isUnfollowPending,
    } = useUnfollow({ follower, followee });

    if (followee.followStatus === null) {
        return null;
    }

    if (followee.followStatus.isFollowedByMe) {

        if(unfollowError){
            messageApi.open({
                type: 'error',
                content: unfollowError.message,
              });
        }

        if(followError){
            messageApi.open({
                type: 'error',
                content: followError.message,
              });
        }

        return (
            <>
               {contextHolder}
                <Button
                    loading={isUnfollowPending}
                    className='flex items-center cursor-pointer justify-center rounded-3xl w-[74px] h-[40px] text-[15px]'
                    style={

                       
                        { background: '#3333330d', color: '#33333399' }
                    }
                    onClick={unfollow}
                >
                    {
                        t('unfollowButton')
                    }
                </Button>
 
            </>
        );
    }

    return (
        <>
        {contextHolder}
            <Button
                loading={isFollowPending}
                className='flex items-center cursor-pointer justify-center rounded-3xl w-[74px] h-[40px] text-[15px]'
                style={

                    { background: '#ff2442', color: '#fff' }

                }
                onClick={follow}
            >
                {
                    t('followButton')
                }
            </Button>
        </>
    );
}
