import { createQueryKeys } from '@lukemorales/query-key-factory';

export const notifications = createQueryKeys('notifications', {
  all: null,
  detail: (notificationId: number) => ['notificationDetail', [notificationId]],
});
