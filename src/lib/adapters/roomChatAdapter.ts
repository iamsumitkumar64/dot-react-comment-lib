import { CommentFieldMapping } from '../types';

/**
 * Interface matching RoomChatEntity
 */
export interface RoomChatEntityLike {
  uuid: string;
  message_parent_uuid?: string | null;
  message: string;
  created_at: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  author_role?: string;
  reactions?: any[];
  is_pinned?: boolean;
}

/**
 * Pre-configured adapter for TypeORM RoomChatEntity or similar relational DB schemas.
 */
export const roomChatSchemaMapping: CommentFieldMapping<RoomChatEntityLike> = {
  idKey: 'uuid',
  parentIdKey: 'message_parent_uuid',
  contentKey: 'message',
  createdAtKey: 'created_at',
  updatedAtKey: 'updated_at',
  deletedAtKey: 'deleted_at',
  authorKey: (item: any) => ({
    id: String(item.author_id || item.user_id || item.authorId || item.uuid || 'user-1'),
    name: item.author_name || item.user_name || item.authorName || 'User',
    avatarUrl: item.author_avatar || item.avatar_url || item.avatar,
    role: item.author_role || item.role,
  }),
  reactionsKey: 'reactions',
  isPinnedKey: 'is_pinned',
};
