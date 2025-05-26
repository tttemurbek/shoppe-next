// types/notification/index.ts

import { BoardArticle } from '../board-article/board-article';
import { Jewellery } from '../jewellery/jewellery';
import { Member } from '../member/member';


export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
}

export enum NotificationStatus {
  WAIT = 'WAIT',
  READ = 'READ',
}

export enum NotificationGroup {
  ARTICLE = 'ARTICLE',
  JEWELLERY = 'JEWELLERY',
  MEMBER = 'MEMBER',
}

export interface Notification {
  _id: string;
  notificationType: NotificationType;
  notificationStatus: NotificationStatus;
  notificationGroup: NotificationGroup;
  notificationTitle: string;
  notificationDesc: string;
  authorId: string | Member;
  receiverId: string | Member;
  jewelleryId?: string | Jewellery;
  articleId?: string | BoardArticle;
  createdAt: Date;
  updatedAt: Date;
}
export interface Notification {
  _id: string;

  notificationType: NotificationType;

  notificationTitle: string; // Add this line

  notificationDesc: string;

  notificationStatus: NotificationStatus;

  createdAt: Date;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}

export interface NotificationCount {
  count: number;
}

// Request payload types
export interface MarkAsReadPayload {
  notificationId: string;
}

export interface GetNotificationsByGroupPayload {
  group: NotificationGroup;
  page?: number;
  limit?: number;
}
