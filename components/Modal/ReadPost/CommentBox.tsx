import { FormEvent, useState } from 'react';

import { Comment } from '@/types/Post';
import { useCreateComment, useCreateReply, useFetchTargetPostComment } from '@queries/usePostQueries';

import CommentContainer from './Comment';
import styles from './CommentBox.module.scss';

export default function CommentBox({ postId }: { postId: number }) {
  const [commentInput, setCommentInput] = useState('');

  const [replyInformation, setReplyInformation] = useState({
    isReply: false,
    targetCommentId: 0,
    targetCommentNickname: '',
  });

  // 댓글 조회
  const { data, isPending, isError, isFetchingNextPage, ref } = useFetchTargetPostComment(postId);

  // 댓글 추가 후 댓글 조회 초기화
  const { mutateAsync: createCommentMutate } = useCreateComment(postId);

  // 답글 추가 후 답글 조회 초기화
  const { mutateAsync: createReplyMutate } = useCreateReply(replyInformation.targetCommentId);

  async function handleSubmitComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // 답글인지 아닌지에 따라 api 호출 다르게 해줌
    replyInformation.isReply
      ? await createReplyMutate({ commentId: replyInformation.targetCommentId, body: { content: commentInput } })
      : await createCommentMutate({ postId, body: { content: commentInput } });
    // 댓글 입력창 초기화
    setCommentInput('');
    setReplyInformation({ isReply: false, targetCommentId: 0, targetCommentNickname: '' });
  }

  if (isPending) {
    // TODO 스켈레톤 UI 추가
    return <div className={styles.loading}>loading...</div>;
  }

  if (isError) {
    return <div>데이터 불러오는 중, 에러 발생</div>;
  }

  const commentsPages = data?.pages ?? [];

  return (
    <div>
      <div className={styles['comment-box']}>
        {commentsPages.map((commentsPage) =>
          commentsPage.data.content.map((comment: Comment) => (
            <CommentContainer key={comment.commentId} comment={comment} setReplyInformation={setReplyInformation} />
          )),
        )}
        {/* // TODO 로딩 인디케이터 추가 */}
        {/* // <div ref={ref} />가 화면에 보일 때 fetchNextPage 호출 */}
        {isFetchingNextPage ? <div className={styles.loading}>로딩 중...</div> : <div ref={ref} />}
      </div>

      <form className={styles['comment-form']} onSubmit={handleSubmitComment}>
        <div>
          {replyInformation.isReply && (
            <span className={styles['target-nickname']}>@{replyInformation.targetCommentNickname}</span>
          )}
          <input
            type='text'
            className={styles['comment-input']}
            placeholder='댓글 남기기'
            onChange={(e) => setCommentInput(e.target.value)}
            value={commentInput}
          />
        </div>
        <button type='submit' className={styles['comment-submit-button']}>
          게시
        </button>
      </form>
    </div>
  );
}
