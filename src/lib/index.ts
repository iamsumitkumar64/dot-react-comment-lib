'use client';

// Main Component
export { NestedComments } from './components/NestedComments';

// Subcomponents for custom compositions
export { CommentList } from './components/CommentList';
export { CommentItem } from './components/CommentItem';
export type { CommentItemProps } from './components/CommentItem';
export { CommentComposer } from './components/CommentComposer';
export type { CommentComposerProps } from './components/CommentComposer';
export { CommentAvatar } from './components/CommentAvatar';
export type { CommentAvatarProps } from './components/CommentAvatar';
export { CommentActions } from './components/CommentActions';
export type { CommentActionsProps } from './components/CommentActions';
export { EmojiReactionPicker } from './components/EmojiReactionPicker';
export type { EmojiReactionPickerProps } from './components/EmojiReactionPicker';
export { ThreadConnector } from './components/ThreadConnector';
export type { ThreadConnectorProps } from './components/ThreadConnector';

// Context & Hooks
export {
  CommentProvider,
  useCommentContext,
  defaultConfig,
} from './context/CommentContext';
export type {
  CommentContextValue,
  CommentProviderProps,
} from './context/CommentContext';
export { useCommentTree } from './hooks/useCommentTree';
export type { UseCommentTreeOptions } from './hooks/useCommentTree';

// Adapters & Data Transformers
export {
  defaultFieldMapping,
  normalizeComment,
  buildCommentTree,
  flattenCommentTree,
  findCommentInTree,
  insertCommentInTree,
  updateCommentInTree,
  deleteCommentInTree,
  sortCommentTree,
  resolveValue,
} from './adapters/schemaAdapter';

export {
  roomChatSchemaMapping,
} from './adapters/roomChatAdapter';
export type { RoomChatEntityLike } from './adapters/roomChatAdapter';

// Utilities
export { formatRelativeTime } from './utils/dateFormatter';
export { getInitials, stringToColor } from './utils/avatarUtils';
export { defaultLabels } from './utils/defaultLabels';

// Types
export type {
  CommentAuthor,
  CommentReaction,
  NormalizedComment,
  CommentFieldMapping,
  KeyOrGetter,
  CommentSortOption,
  CommentLabels,
  CommentCustomRenderers,
  ComposerRenderProps,
  NestedCommentsConfig,
  CommentPermissions,
  CommentCustomStyles,
  CommentClassNames,
  NestedCommentsProps,
} from './types';
