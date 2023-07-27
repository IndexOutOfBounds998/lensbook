import {
    AnyPublication,
    Comment,
    ProfileOwnedByMe,
} from '@lens-protocol/react-web';

import { Button, message } from 'antd';

import { useTranslation } from "react-i18next";

import { useSendComment } from '@/app/hooks/useSendComment';

type CollectButtonProps = {
    comments: any[];
    comment: any;
    profile: ProfileOwnedByMe;
    publication: AnyPublication;
    onChange: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function SendCommentButton({ comments, comment, profile, publication ,onChange}: CollectButtonProps) {

    const [messageApi, contextHolder] = message.useMessage();

    const { t } = useTranslation();

    //发布评论
    const { submit: send, loading } = useSendComment({ publication: publication });

    const sendComment = () => {

        if (comment.input.value && !loading && profile) {
            send(comment.input.value, profile).then(res => {

                const newComment = {
                    __typename: "Comment",
                    metadata: {
                        __typename: 'MetadataOutput',
                        content: comment.input.value
                    },
                    profile: profile
                };

                comments = [...comments, newComment];

                onChange(comments);
                console.log(comments);
                messageApi.success("success");
            })
                .catch(error => {
                    console.error(error);
                });
        }

    }


    return (
        <>
            {contextHolder}
            <Button
                onClick={sendComment}
                loading={loading} className='h-full bg-[#6790db] cursor-pointer w-[80px] rounded-3xl flex justify-center items-center text-[#fff] text-[16px]'
            >
                {t('sendMessageBtn')}
            </Button>
        </>
    );

}


