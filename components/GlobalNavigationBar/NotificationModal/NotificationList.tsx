import { Notification } from '@/types/Notification';
import { useFetchNotificationList } from '@queries/useNotificationQueries';

import NotificationItem from './NotificationItem';
import styles from './NotificationList.module.scss';

export default function NotificationList() {
  const { data, isPending, isError, isFetchingNextPage, ref } = useFetchNotificationList();
  const notificationPages = data?.pages ?? [];

  if (isPending) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <div>데이터 불러오는 중, 에러 발생</div>;
  }

  return (
    <div className={styles.container}>
      {notificationPages &&
        notificationPages.map((notificationsPage: { data: { content: Notification[] } }) =>
          notificationsPage.data.content.map((notification) => (
            <NotificationItem key={notification.notificationId} notification={notification} />
          )),
        )}

      {isFetchingNextPage ? <div>로딩 중...</div> : <div ref={ref} />}
    </div>
  );
}
