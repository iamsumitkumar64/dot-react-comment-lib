import * as React from 'react';
import React__default, { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * Author / User metadata associated with a comment
 */
interface CommentAuthor {
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
interface CommentReaction {
    emoji: string;
    count: number;
    users?: (string | CommentAuthor)[];
    hasReacted?: boolean;
}
/**
 * Unified internal comment representation after applying schema adapter
 */
interface NormalizedComment<TRaw = unknown> {
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
type KeyOrGetter<T, R> = keyof T | ((item: T) => R);
interface CommentFieldMapping<T = Record<string, unknown>> {
    idKey?: KeyOrGetter<T, string>;
    parentIdKey?: KeyOrGetter<T, string | null | undefined>;
    contentKey?: KeyOrGetter<T, string>;
    createdAtKey?: KeyOrGetter<T, Date | string | number>;
    updatedAtKey?: KeyOrGetter<T, Date | string | number | null | undefined>;
    deletedAtKey?: KeyOrGetter<T, Date | string | number | null | undefined>;
    authorKey?: KeyOrGetter<T, CommentAuthor>;
    authorIdKey?: KeyOrGetter<T, string>;
    authorNameKey?: KeyOrGetter<T, string>;
    authorAvatarKey?: KeyOrGetter<T, string | null | undefined>;
    authorRoleKey?: KeyOrGetter<T, string | null | undefined>;
    reactionsKey?: KeyOrGetter<T, CommentReaction[] | undefined>;
    isPinnedKey?: KeyOrGetter<T, boolean | undefined>;
    repliesKey?: KeyOrGetter<T, T[] | undefined>;
}
/**
 * Sorting criteria
 */
type CommentSortOption = 'newest' | 'oldest' | 'mostUpvoted' | 'mostReplies';
/**
 * Internationalization & custom text labels
 */
interface CommentLabels {
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
interface CommentCustomStyles {
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
interface CommentClassNames {
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
interface CommentCustomRenderers<T = unknown> {
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
interface ComposerRenderProps {
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
interface NestedCommentsConfig {
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
interface CommentPermissions<T = unknown> {
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
interface NestedCommentsProps<T = Record<string, unknown>> {
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

declare function NestedComments<T = Record<string, unknown>>({ comments: rawComments, schema, currentUser, config, permissions, labels, styles, classes, renderers, onSubmitComment, onEditComment, onDeleteComment, onReactComment, onPinComment, onReportComment, onSortChange, formatDate, className, sx, }: NestedCommentsProps<T>): React__default.JSX.Element;

declare const CommentList: React__default.FC;

interface CommentItemProps {
    comment: NormalizedComment;
}
declare const CommentItem: React__default.NamedExoticComponent<CommentItemProps>;

interface CommentComposerProps {
    parentId?: string | null;
    parentComment?: NormalizedComment;
    placeholder?: string;
    isReply?: boolean;
    initialValue?: string;
    isEdit?: boolean;
    onCancel?: () => void;
    onSuccess?: () => void;
    autoFocus?: boolean;
}
declare const CommentComposer: React__default.NamedExoticComponent<CommentComposerProps>;

interface CommentAvatarProps {
    author: CommentAuthor;
    comment?: NormalizedComment;
    size?: number;
}
declare const CommentAvatar: React__default.NamedExoticComponent<CommentAvatarProps>;

interface CommentActionsProps {
    comment: NormalizedComment;
}
declare const CommentActions: React__default.NamedExoticComponent<CommentActionsProps>;

interface EmojiReactionPickerProps {
    comment: NormalizedComment;
}
declare const EmojiReactionPicker: React__default.NamedExoticComponent<EmojiReactionPickerProps>;

interface ThreadConnectorProps {
    onToggleCollapse?: () => void;
    isCollapsed?: boolean;
}
declare const ThreadConnector: React__default.NamedExoticComponent<ThreadConnectorProps>;

interface CommentContextValue<T = unknown> {
    comments: NormalizedComment<T>[];
    currentUser?: CommentAuthor;
    config: Required<NestedCommentsConfig>;
    permissions: CommentPermissions<T>;
    labels: CommentLabels;
    renderers: CommentCustomRenderers<T>;
    styles: CommentCustomStyles;
    classes: CommentClassNames;
    sortBy: CommentSortOption;
    setSortBy: (sort: CommentSortOption) => void;
    activeReplyId: string | null;
    setActiveReplyId: (id: string | null) => void;
    activeEditId: string | null;
    setActiveEditId: (id: string | null) => void;
    collapsedIds: Set<string>;
    toggleCollapse: (id: string) => void;
    isCollapsed: (id: string) => boolean;
    handleSubmitComment: (content: string, parentId?: string | null) => Promise<boolean>;
    handleEditComment: (id: string, content: string) => Promise<boolean>;
    handleDeleteComment: (id: string) => Promise<boolean>;
    handleReactComment: (id: string, emoji: string) => Promise<boolean>;
    handlePinComment: (id: string) => Promise<boolean>;
    handleReportComment: (id: string) => Promise<boolean>;
    formatDate: (date: Date | string | number) => string;
}
declare const defaultConfig: Required<NestedCommentsConfig>;
interface CommentProviderProps<T = unknown> {
    children: React__default.ReactNode;
    comments: NormalizedComment<T>[];
    currentUser?: CommentAuthor;
    config?: NestedCommentsConfig;
    permissions?: CommentPermissions<T>;
    labels?: Partial<CommentLabels>;
    styles?: CommentCustomStyles;
    classes?: CommentClassNames;
    renderers?: CommentCustomRenderers<T>;
    formatDate?: (date: Date | string | number) => string;
    sortBy?: CommentSortOption;
    onSortChange?: (sort: CommentSortOption) => void;
    onSubmitComment?: (data: {
        content: string;
        parentId: string | null;
        parentComment?: NormalizedComment<T>;
    }) => Promise<void> | void;
    onEditComment?: (data: {
        id: string;
        content: string;
        comment: NormalizedComment<T>;
    }) => Promise<void> | void;
    onDeleteComment?: (data: {
        id: string;
        comment: NormalizedComment<T>;
    }) => Promise<void> | void;
    onReactComment?: (data: {
        id: string;
        emoji: string;
        comment: NormalizedComment<T>;
        action: 'add' | 'remove';
    }) => Promise<void> | void;
    onPinComment?: (data: {
        id: string;
        isPinned: boolean;
        comment: NormalizedComment<T>;
    }) => Promise<void> | void;
    onReportComment?: (data: {
        id: string;
        comment: NormalizedComment<T>;
    }) => Promise<void> | void;
}
declare function CommentProvider<T = unknown>({ children, comments, currentUser, config: userConfig, permissions, labels: userLabels, styles, classes, renderers, formatDate, sortBy: controlledSortBy, onSortChange, onSubmitComment, onEditComment, onDeleteComment, onReactComment, onPinComment, onReportComment, }: CommentProviderProps<T>): React__default.JSX.Element;
declare function useCommentContext<T = unknown>(): CommentContextValue<T>;

interface UseCommentTreeOptions<T = Record<string, unknown>> {
    initialData?: T[];
    schema?: CommentFieldMapping<T> | 'room-chat' | 'default';
    enableNesting?: boolean;
    maxDepth?: number;
    sortBy?: CommentSortOption;
    currentUser?: CommentAuthor;
}
declare function useCommentTree<T = Record<string, unknown>>({ initialData, schema, enableNesting, maxDepth, sortBy, currentUser, }: UseCommentTreeOptions<T>): {
    comments: NormalizedComment<T>[];
    rawTree: NormalizedComment<T>[];
    setTree: React.Dispatch<React.SetStateAction<NormalizedComment<T>[]>>;
    sortBy: CommentSortOption;
    setSortBy: React.Dispatch<React.SetStateAction<CommentSortOption>>;
    addComment: (content: string, parentId?: string | null, author?: CommentAuthor) => NormalizedComment<T>;
    editComment: (id: string, newContent: string) => void;
    deleteComment: (id: string, softDelete?: boolean) => void;
    reactToComment: (id: string, emoji: string, user?: CommentAuthor) => void;
    pinComment: (id: string) => void;
    totalComments: number;
};

/**
 * Helper to resolve a value either from an object key or a custom getter function.
 */
declare function resolveValue<T, R>(item: T, keyOrGetter?: KeyOrGetter<T, R>, defaultValue?: R): R | undefined;
/**
 * Default fallback field mapping adapter
 */
declare const defaultFieldMapping: CommentFieldMapping<Record<string, unknown>>;
/**
 * Normalizes any raw data item into a unified NormalizedComment structure.
 */
declare function normalizeComment<T = Record<string, unknown>>(rawItem: T, mapping?: CommentFieldMapping<T>, currentDepth?: number): NormalizedComment<T>;
/**
 * Builds a nested comment tree from a flat list of normalized comments.
 */
declare function buildCommentTree<T = unknown>(comments: NormalizedComment<T>[], maxDepth?: number): NormalizedComment<T>[];
/**
 * Flattens a comment tree back into a single 1D array.
 */
declare function flattenCommentTree<T = unknown>(tree: NormalizedComment<T>[]): NormalizedComment<T>[];
/**
 * Finds a comment by its ID in a nested tree.
 */
declare function findCommentInTree<T = unknown>(tree: NormalizedComment<T>[], id: string): NormalizedComment<T> | null;
/**
 * Inserts a new comment into a tree (either at root or as reply to parent).
 */
declare function insertCommentInTree<T = unknown>(tree: NormalizedComment<T>[], newComment: NormalizedComment<T>, parentId?: string | null): NormalizedComment<T>[];
/**
 * Updates a comment in a tree by ID.
 */
declare function updateCommentInTree<T = unknown>(tree: NormalizedComment<T>[], id: string, updater: (comment: NormalizedComment<T>) => NormalizedComment<T>): NormalizedComment<T>[];
/**
 * Deletes a comment from a tree.
 * If softDelete is true, sets deletedAt on the comment.
 * If false, completely removes node from the tree.
 */
declare function deleteCommentInTree<T = unknown>(tree: NormalizedComment<T>[], id: string, softDelete?: boolean): NormalizedComment<T>[];
/**
 * Sorts root comments and their replies recursively.
 */
declare function sortCommentTree<T = unknown>(tree: NormalizedComment<T>[], sortOption?: CommentSortOption): NormalizedComment<T>[];

/**
 * Interface matching RoomChatEntity
 */
interface RoomChatEntityLike {
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
declare const roomChatSchemaMapping: CommentFieldMapping<RoomChatEntityLike>;

/**
 * Formats a date/timestamp into a friendly relative or absolute string.
 */
declare function formatRelativeTime(dateInput: Date | string | number | undefined | null): string;

/**
 * Generates initials from a full name (e.g. "John Doe" -> "JD", "Antigravity" -> "A")
 */
declare function getInitials(name?: string | null): string;
/**
 * Generates a pleasant HSL color based on string hash for user avatars
 */
declare function stringToColor(str?: string | null): string;

declare const defaultLabels: CommentLabels;

export { CommentActions, type CommentActionsProps, type CommentAuthor, CommentAvatar, type CommentAvatarProps, type CommentClassNames, CommentComposer, type CommentComposerProps, type CommentContextValue, type CommentCustomRenderers, type CommentCustomStyles, type CommentFieldMapping, CommentItem, type CommentItemProps, type CommentLabels, CommentList, type CommentPermissions, CommentProvider, type CommentProviderProps, type CommentReaction, type CommentSortOption, type ComposerRenderProps, EmojiReactionPicker, type EmojiReactionPickerProps, type KeyOrGetter, NestedComments, type NestedCommentsConfig, type NestedCommentsProps, type NormalizedComment, type RoomChatEntityLike, ThreadConnector, type ThreadConnectorProps, type UseCommentTreeOptions, buildCommentTree, defaultConfig, defaultFieldMapping, defaultLabels, deleteCommentInTree, findCommentInTree, flattenCommentTree, formatRelativeTime, getInitials, insertCommentInTree, normalizeComment, resolveValue, roomChatSchemaMapping, sortCommentTree, stringToColor, updateCommentInTree, useCommentContext, useCommentTree };
