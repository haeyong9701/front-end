import { useEffect } from 'react';

import classNames from 'classnames/bind';

import { filteredData } from '@/app/feed/page';
import CommentItem from '@/app/mypage/_components/Comment/CommentItem';
import { Comment, Post } from '@/types/Post';
import { useFetchBookmarkList, useFetchCommentList, useFetchFeedList, useFetchPostList } from '@queries/usePostQueries';

import PostItem from './PostItem';
import styles from './PostList.module.scss';

const cx = classNames.bind(styles);

interface GetPostListProps {
  userId?: number;
  selectedTab?: string;
  filteredData?: filteredData;
}

// TODO:리팩토링 해야됨
export default function PostList({ userId, selectedTab, filteredData }: GetPostListProps) {
  // 찾아야함
  let fetchDataFunction: any;
  switch (selectedTab) {
    case 'MyPosts':
      fetchDataFunction = useFetchPostList;
      break;
    case 'Bookmarks':
      fetchDataFunction = useFetchBookmarkList;
      break;
    case 'MyComments':
      fetchDataFunction = useFetchCommentList;
      break;
    case 'Feed':
      fetchDataFunction = useFetchFeedList;
      break;
    default:
      fetchDataFunction = useFetchPostList; // 기본값으로 내가 쓴 글을 가져오도록 설정함
      break;
  }

  const { data, isPending, isError, isFetchingNextPage, ref, refetch } = userId
    ? fetchDataFunction(userId)
    : fetchDataFunction(filteredData);

  useEffect(() => {
    refetch();
  }, [filteredData, refetch]);

  if (isPending) {
    // TODO 스켈레톤 UI 추가
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>데이터 불러오는 중, 에러 발생</div>;
  }

  const postsPages = data?.pages ?? [];

  return (
    <div className={cx('container')}>
      {fetchDataFunction === useFetchCommentList
        ? postsPages.map((postsPage: { data: { content: Comment[] } }) =>
            postsPage.data.content.map((comment) => <CommentItem key={comment.commentId} comment={comment} />),
          )
        : postsPages.map((postsPage: { data: { content: Post[] } }) =>
            postsPage.data.content.map((post: Post) => <PostItem key={post.postId} post={post} />),
          )}

      {/*  TODO 로딩 인디케이터 추가 */}

      {isFetchingNextPage ? <div>로딩 중...</div> : <div ref={ref} />}
    </div>
  );
}
