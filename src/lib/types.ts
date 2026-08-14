import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * Author / User metadata associated with a comment
 */
export interface CommentAuthor {
  id: string;
  name: string;
  avatarUrl?: string | null;
  role?: string | null;
  email?: string | null;
  badge?: string | null;
  customData?: Record<string, unknown>;
}

/**
 * Single emoji reaction object
 */
export interface CommentReaction {
  emoji: string;
  count: number;
  users?: (string | CommentAuthor)[];
  hasReacted?: boolean;
}

/**
 * Unified internal comment representation after applying schema adapter
 */
export interface NormalizedComment<TRaw = unknown> {
  id: string;
  parentId: string | null;
  content: string;
  createdAt: Date | string | number;
  updatedAt?: Date | string | number | null;
  deletedAt?: Date | string | number | null;
  author: CommentAuthor;
  reactions?: CommentReaction[];
  isPinned?: boolean;
  depth: number;
  replies?: NormalizedComment<TRaw>[];
  raw?: TRaw;
}

/**
 * Flexible database schema mapping configuration.
 * Allows mapping any backend data structure (TypeORM, Prisma, REST API, Supabase, MongoDB)
 * to the nested comments component.
 */
export type KeyOrGetter<T, R> = keyof T | ((item: T) => R);

export interface CommentFieldMapping<T = Record<string, unknown>> {
  idKey?: KeyOrGetter<T, string>;
  parentIdKey?: KeyOrGetter<T, string | null | undefined>;
  contentKey?: KeyOrGetter<T, string>;
  createdAtKey?: KeyOrGetter<T, Date | string | number>;
  updatedAtKey?: KeyOrGetter<T, Date | string | number | null | undefined>;
  deletedAtKey?: KeyOrGetter<T, Date | string | number | null | undefined>;
  
  // Author mapping options
  authorKey?: KeyOrGetter<T, CommentAuthor>;
  authorIdKey?: KeyOrGetter<T, string>;
  authorNameKey?: KeyOrGetter<T, string>;
  authorAvatarKey?: KeyOrGetter<T, string | null | undefined>;
  authorRoleKey?: KeyOrGetter<T, string | null | undefined>;
  
  // Reactions & status
  reactionsKey?: KeyOrGetter<T, CommentReaction[] | undefined>;
  isPinnedKey?: KeyOrGetter<T, boolean | undefined>;
  repliesKey?: KeyOrGetter<T, T[] | undefined>;
}

/**
 * Sorting criteria
 */
export type CommentSortOption = 'newest' | 'oldest' | 'mostUpvoted' | 'mostReplies';

/**
 * Internationalization & custom text labels
 */
export interface CommentLabels {
  title: string;
  writeCommentPlaceholder: string;
  writeReplyPlaceholder: string;
  postButton: string;
  replyButton: string;
  cancelButton: string;
  saveButton: string;
  editAction: string;
  deleteAction: string;
  replyAction: string;
  pinAction: string;
  unpinAction: string;
  reportAction: string;
  editedTag: string;
  pinnedTag: string;
  deletedMessage: string;
  loadMoreReplies: string;
  hideReplies: string;
  viewReplies: (count: number) => string;
  noComments: string;
  sortNewest: string;
  sortOldest: string;
  sortPopular: string;
  confirmDeleteTitle: string;
  confirmDeleteBody: string;
  validationRequired: string;
  validationMinLength: (min: number) => string;
  validationMaxLength: (max: number) => string;
}

/**
 * Granular custom styling for every UI component and slot in the library
 */
export interface CommentCustomStyles {
  /** Root container */
  root?: SxProps<Theme>;
  /** Header bar with count & sort control */
  header?: SxProps<Theme>;
  /** Title text */
  title?: SxProps<Theme>;
  /** Comment count badge */
  countBadge?: SxProps<Theme>;
  /** Sort select dropdown */
  sortSelect?: SxProps<Theme>;
  /** Main comment composer container */
  composer?: SxProps<Theme>;
  /** Textarea input inside composer */
  composerInput?: SxProps<Theme>;
  /** Composer bottom toolbar */
  composerToolbar?: SxProps<Theme>;
  /** Composer submit button */
  composerSubmitButton?: SxProps<Theme>;
  /** Composer cancel button */
  composerCancelButton?: SxProps<Theme>;
  /** Composer emoji trigger button */
  composerEmojiButton?: SxProps<Theme>;
  /** Single comment item container */
  commentItem?: SxProps<Theme>;
  /** Comment avatar */
  avatar?: SxProps<Theme>;
  /** Comment header row */
  commentHeader?: SxProps<Theme>;
  /** Author name text */
  authorName?: SxProps<Theme>;
  /** Author role/badge chip */
  authorBadge?: SxProps<Theme>;
  /** Timestamp text */
  timestamp?: SxProps<Theme>;
  /** Pinned tag badge */
  pinnedBadge?: SxProps<Theme>;
  /** Edited indicator text */
  editedTag?: SxProps<Theme>;
  /** Comment body text / content */
  commentBody?: SxProps<Theme>;
  /** Actions container */
  actionsContainer?: SxProps<Theme>;
  /** Reply action button */
  replyButton?: SxProps<Theme>;
  /** Edit action button */
  editButton?: SxProps<Theme>;
  /** Delete action button */
  deleteButton?: SxProps<Theme>;
  /** Pin action button */
  pinButton?: SxProps<Theme>;
  /** More options menu button */
  moreMenuButton?: SxProps<Theme>;
  /** Reactions bar container */
  reactionsContainer?: SxProps<Theme>;
  /** Single reaction chip / pill */
  reactionChip?: SxProps<Theme>;
  /** Active reaction chip (when current user has reacted) */
  activeReactionChip?: SxProps<Theme>;
  /** Add reaction '+' button */
  addReactionButton?: SxProps<Theme>;
  /** Vertical thread line connector */
  threadLine?: SxProps<Theme>;
  /** Collapse / expand replies button */
  collapseButton?: SxProps<Theme>;
  /** Nested replies container */
  repliesContainer?: SxProps<Theme>;
  /** Empty state placeholder box */
  emptyState?: SxProps<Theme>;
  /** Deleted comment text */
  deletedCommentText?: SxProps<Theme>;
}

/**
 * Custom CSS class names for every UI component
 */
export interface CommentClassNames {
  root?: string;
  header?: string;
  title?: string;
  countBadge?: string;
  composer?: string;
  commentItem?: string;
  commentHeader?: string;
  avatar?: string;
  authorName?: string;
  authorBadge?: string;
  commentBody?: string;
  actions?: string;
  reactions?: string;
  threadLine?: string;
  replies?: string;
  emptyState?: string;
}

/**
 * Custom render slots for full UI control
 */
export interface CommentCustomRenderers<T = unknown> {
  avatar?: (author: CommentAuthor, comment: NormalizedComment<T>) => ReactNode;
  header?: (comment: NormalizedComment<T>, defaultHeader: ReactNode) => ReactNode;
  body?: (comment: NormalizedComment<T>, defaultBody: ReactNode) => ReactNode;
  actions?: (comment: NormalizedComment<T>, defaultActions: ReactNode) => ReactNode;
  composer?: (props: ComposerRenderProps) => ReactNode;
  emptyState?: () => ReactNode;
}

/**
 * Props passed to custom composer renderer
 */
export interface ComposerRenderProps {
  parentId?: string | null;
  placeholder?: string;
  isReply?: boolean;
  onSubmit: (content: string) => Promise<boolean | void> | boolean | void;
  onCancel?: () => void;
  autoFocus?: boolean;
}

/**
 * Configuration for business rules & UI options
 */
export interface NestedCommentsConfig {
  /**
   * Whether nesting/threading is enabled.
   * If false, renders as a flat sequential linear list.
   * @default true
   */
  enableNesting?: boolean;

  /**
   * Maximum allowed nesting depth (0 = top-level only, 1 = 1 level of replies, Infinity = unlimited).
   * When max depth is reached, new replies can either be disabled or attached at the max depth level.
   * @default Infinity
   */
  maxDepth?: number;

  /**
   * Indentation in pixels per nesting level.
   * @default 28
   */
  indentSize?: number;

  /**
   * Whether to display user avatars.
   * Useful when business rules dictate no user photos should be shown.
   * @default true
   */
  showAvatars?: boolean;

  /**
   * Shape of the avatar.
   * @default 'circle'
   */
  avatarShape?: 'circle' | 'rounded' | 'square';

  /**
   * Whether to render connecting thread lines for nested replies.
   * @default true
   */
  showThreadLines?: boolean;

  /**
   * Whether comment threads can be collapsed/expanded.
   * @default true
   */
  collapsible?: boolean;

  /**
   * Default collapse/expand state for comment replies.
   * @default true
   */
  defaultExpanded?: boolean;

  /**
   * Enable emoji reaction bar and picker.
   * @default true
   */
  enableReactions?: boolean;

  /**
   * List of quick emoji reactions to display on hover/click.
   * @default ['👍', '❤️', '🔥', '🎉', '🚀', '👀']
   */
  quickReactions?: string[];

  /**
   * Enable full emoji picker popup via emoji-picker-react.
   * @default true
   */
  enableEmojiPicker?: boolean;

  /**
   * How to handle soft-deleted comments (where deletedAt is set).
   * - 'placeholder': Renders "[This comment was deleted]" while keeping reply branch intact.
   * - 'hide': Completely removes the comment and its subtree.
   * @default 'placeholder'
   */
  softDeleteHandling?: 'placeholder' | 'hide';

  /**
   * Position of the main new-comment composer.
   * @default 'top'
   */
  composerPosition?: 'top' | 'bottom' | 'both' | 'none';

  /**
   * Show sort dropdown control.
   * @default true
   */
  showSortControl?: boolean;

  /**
   * Initial or controlled sort order.
   * @default 'newest'
   */
  sortBy?: CommentSortOption;

  /**
   * Minimum content character length for validation.
   * @default 1
   */
  minContentLength?: number;

  /**
   * Maximum content character length for validation.
   * @default 5000
   */
  maxContentLength?: number;

  /**
   * Auto focus input when replying.
   * @default true
   */
  autoFocusOnReply?: boolean;
}

/**
 * Permission checks (boolean or functional predicate per comment)
 */
export interface CommentPermissions<T = unknown> {
  canReply?: boolean | ((comment: NormalizedComment<T>, currentUser?: CommentAuthor) => boolean);
  canEdit?: boolean | ((comment: NormalizedComment<T>, currentUser?: CommentAuthor) => boolean);
  canDelete?: boolean | ((comment: NormalizedComment<T>, currentUser?: CommentAuthor) => boolean);
  canReact?: boolean | ((comment: NormalizedComment<T>, currentUser?: CommentAuthor) => boolean);
  canPin?: boolean | ((comment: NormalizedComment<T>, currentUser?: CommentAuthor) => boolean);
  canReport?: boolean | ((comment: NormalizedComment<T>, currentUser?: CommentAuthor) => boolean);
}

/**
 * Main Props for `<NestedComments />`
 */
export interface NestedCommentsProps<T = Record<string, unknown>> {
  /**
   * Array of comments. Can be flat list (with parent IDs) or nested tree.
   */
  comments: T[];

  /**
   * Database schema field mapping adapter or preset name ('room-chat' | 'default').
   */
  schema?: CommentFieldMapping<T> | 'room-chat' | 'default';

  /**
   * The currently logged-in user viewing/posting comments.
   */
  currentUser?: CommentAuthor;

  /**
   * Business rules & UI configuration options.
   */
  config?: NestedCommentsConfig;

  /**
   * Permissions and access control.
   */
  permissions?: CommentPermissions<T>;

  /**
   * Custom text labels & internationalization.
   */
  labels?: Partial<CommentLabels>;

  /**
   * Granular styling overrides for all elements in the component.
   */
  styles?: CommentCustomStyles;

  /**
   * Custom CSS classes for elements.
   */
  classes?: CommentClassNames;

  /**
   * Custom render slots for advanced customizations.
   */
  renderers?: CommentCustomRenderers<T>;

  /**
   * Callback fired when submitting a new top-level or reply comment.
   */
  onSubmitComment?: (data: {
    content: string;
    parentId: string | null;
    parentComment?: NormalizedComment<T>;
  }) => Promise<void> | void;

  /**
   * Callback fired when editing a comment.
   */
  onEditComment?: (data: {
    id: string;
    content: string;
    comment: NormalizedComment<T>;
  }) => Promise<void> | void;

  /**
   * Callback fired when deleting a comment.
   */
  onDeleteComment?: (data: {
    id: string;
    comment: NormalizedComment<T>;
    isPermanent?: boolean;
  }) => Promise<void> | void;

  /**
   * Callback fired when reacting with an emoji.
   */
  onReactComment?: (data: {
    id: string;
    emoji: string;
    comment: NormalizedComment<T>;
    action: 'add' | 'remove';
  }) => Promise<void> | void;

  /**
   * Callback fired when pinning or unpinning a comment.
   */
  onPinComment?: (data: {
    id: string;
    isPinned: boolean;
    comment: NormalizedComment<T>;
  }) => Promise<void> | void;

  /**
   * Callback fired when user reports a comment.
   */
  onReportComment?: (data: {
    id: string;
    comment: NormalizedComment<T>;
  }) => Promise<void> | void;

  /**
   * Controlled sort change handler.
   */
  onSortChange?: (sort: CommentSortOption) => void;

  /**
   * Custom date formatter function. Defaults to relative time (e.g. "2h ago").
   */
  formatDate?: (date: Date | string | number) => string;

  /**
   * Root CSS class name.
   */
  className?: string;

  /**
   * MUI sx styling props for root container.
   */
  sx?: SxProps<Theme>;
}
