import {
  CommentAuthor,
  CommentFieldMapping,
  CommentReaction,
  CommentSortOption,
  KeyOrGetter,
  NormalizedComment,
} from '../types';

/**
 * Helper to resolve a value either from an object key or a custom getter function.
 */
export function resolveValue<T, R>(
  item: T,
  keyOrGetter?: KeyOrGetter<T, R>,
  defaultValue?: R
): R | undefined {
  if (keyOrGetter === undefined || keyOrGetter === null) {
    return defaultValue;
  }
  if (typeof keyOrGetter === 'function') {
    return (keyOrGetter as (item: T) => R)(item);
  }
  if (typeof keyOrGetter === 'string' && typeof item === 'object' && item !== null) {
    const val = (item as Record<string, unknown>)[keyOrGetter];
    return (val !== undefined && val !== null ? (val as R) : defaultValue);
  }
  return defaultValue;
}

/**
 * Default fallback field mapping adapter
 */
export const defaultFieldMapping: CommentFieldMapping<Record<string, unknown>> = {
  idKey: (item: any) => String(item.id || item._id || item.uuid || ''),
  parentIdKey: (item: any) => item.parentId ?? item.parent_id ?? item.message_parent_uuid ?? null,
  contentKey: (item: any) => item.content ?? item.message ?? item.text ?? item.body ?? '',
  createdAtKey: (item: any) => item.createdAt ?? item.created_at ?? item.timestamp ?? new Date(),
  updatedAtKey: (item: any) => item.updatedAt ?? item.updated_at ?? undefined,
  deletedAtKey: (item: any) => item.deletedAt ?? item.deleted_at ?? undefined,
  authorKey: (item: any) => {
    if (item.author) return item.author;
    if (item.user) {
      return {
        id: String(item.user.id || item.user.uuid || 'anonymous'),
        name: item.user.name || item.user.username || 'Anonymous',
        avatarUrl: item.user.avatarUrl || item.user.avatar || item.user.image,
        role: item.user.role,
        email: item.user.email,
        badge: item.user.badge,
      };
    }
    return {
      id: String(item.authorId || item.userId || item.user_id || 'anonymous'),
      name: item.authorName || item.userName || item.user_name || 'Anonymous',
      avatarUrl: item.authorAvatar || item.userAvatar || item.avatar_url,
      role: item.authorRole || item.role,
      email: item.authorEmail || item.email,
    };
  },
  reactionsKey: (item: any) => item.reactions || [],
  isPinnedKey: (item: any) => Boolean(item.isPinned ?? item.is_pinned ?? item.pinned),
  repliesKey: (item: any) => item.replies ?? item.children,
};

/**
 * Normalizes any raw data item into a unified NormalizedComment structure.
 */
export function normalizeComment<T = Record<string, unknown>>(
  rawItem: T,
  mapping?: CommentFieldMapping<T>,
  currentDepth = 0
): NormalizedComment<T> {
  const map = mapping || (defaultFieldMapping as unknown as CommentFieldMapping<T>);

  const id = resolveValue(rawItem, map.idKey, '') ?? '';
  const parentId = resolveValue(rawItem, map.parentIdKey, null) ?? null;
  const content = resolveValue(rawItem, map.contentKey, '') ?? '';
  const createdAt = resolveValue(rawItem, map.createdAtKey, new Date()) ?? new Date();
  const updatedAt = resolveValue(rawItem, map.updatedAtKey, undefined);
  const deletedAt = resolveValue(rawItem, map.deletedAtKey, undefined);

  // Author resolution
  let author: CommentAuthor;
  const directAuthor = resolveValue(rawItem, map.authorKey, undefined);
  if (directAuthor && typeof directAuthor === 'object') {
    author = directAuthor;
  } else {
    const authorId = resolveValue(rawItem, map.authorIdKey, 'anonymous') || 'anonymous';
    const authorName = resolveValue(rawItem, map.authorNameKey, 'Anonymous') || 'Anonymous';
    const authorAvatar = resolveValue(rawItem, map.authorAvatarKey, undefined);
    const authorRole = resolveValue(rawItem, map.authorRoleKey, undefined);

    author = {
      id: String(authorId),
      name: String(authorName),
      avatarUrl: authorAvatar,
      role: authorRole,
    };
  }

  const reactions = resolveValue(rawItem, map.reactionsKey, []) || [];
  const isPinned = Boolean(resolveValue(rawItem, map.isPinnedKey, false));

  // Process nested replies if present in raw item
  const rawReplies = resolveValue(rawItem, map.repliesKey, undefined);
  let replies: NormalizedComment<T>[] | undefined = undefined;
  if (Array.isArray(rawReplies) && rawReplies.length > 0) {
    replies = rawReplies.map((reply) =>
      normalizeComment(reply, mapping, currentDepth + 1)
    );
  }

  return {
    id: String(id),
    parentId: parentId ? String(parentId) : null,
    content: String(content),
    createdAt,
    updatedAt: updatedAt ? updatedAt : null,
    deletedAt: deletedAt ? deletedAt : null,
    author,
    reactions: reactions as CommentReaction[],
    isPinned,
    depth: currentDepth,
    replies,
    raw: rawItem,
  };
}

/**
 * Builds a nested comment tree from a flat list of normalized comments.
 */
export function buildCommentTree<T = unknown>(
  comments: NormalizedComment<T>[],
  maxDepth = Infinity
): NormalizedComment<T>[] {
  const commentMap = new Map<string, NormalizedComment<T>>();
  const rootComments: NormalizedComment<T>[] = [];

  // Clone comments and initialize empty replies array
  comments.forEach((c) => {
    commentMap.set(c.id, {
      ...c,
      replies: c.replies ? [...c.replies] : [],
      depth: 0,
    });
  });

  // Assign children to parents
  commentMap.forEach((comment) => {
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      if (!parent.replies) {
        parent.replies = [];
      }
      // Calculate depth based on parent
      comment.depth = Math.min(parent.depth + 1, maxDepth);
      parent.replies.push(comment);
    } else {
      comment.depth = 0;
      rootComments.push(comment);
    }
  });

  return rootComments;
}

/**
 * Flattens a comment tree back into a single 1D array.
 */
export function flattenCommentTree<T = unknown>(
  tree: NormalizedComment<T>[]
): NormalizedComment<T>[] {
  const result: NormalizedComment<T>[] = [];

  function traverse(nodes: NormalizedComment<T>[]) {
    nodes.forEach((node) => {
      result.push(node);
      if (node.replies && node.replies.length > 0) {
        traverse(node.replies);
      }
    });
  }

  traverse(tree);
  return result;
}

/**
 * Finds a comment by its ID in a nested tree.
 */
export function findCommentInTree<T = unknown>(
  tree: NormalizedComment<T>[],
  id: string
): NormalizedComment<T> | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.replies && node.replies.length > 0) {
      const found = findCommentInTree(node.replies, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Inserts a new comment into a tree (either at root or as reply to parent).
 */
export function insertCommentInTree<T = unknown>(
  tree: NormalizedComment<T>[],
  newComment: NormalizedComment<T>,
  parentId: string | null = null
): NormalizedComment<T>[] {
  if (!parentId) {
    return [newComment, ...tree];
  }

  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        replies: [...(node.replies || []), { ...newComment, depth: node.depth + 1 }],
      };
    }
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: insertCommentInTree(node.replies, newComment, parentId),
      };
    }
    return node;
  });
}

/**
 * Updates a comment in a tree by ID.
 */
export function updateCommentInTree<T = unknown>(
  tree: NormalizedComment<T>[],
  id: string,
  updater: (comment: NormalizedComment<T>) => NormalizedComment<T>
): NormalizedComment<T>[] {
  return tree.map((node) => {
    if (node.id === id) {
      return updater(node);
    }
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: updateCommentInTree(node.replies, id, updater),
      };
    }
    return node;
  });
}

/**
 * Deletes a comment from a tree.
 * If softDelete is true, sets deletedAt on the comment.
 * If false, completely removes node from the tree.
 */
export function deleteCommentInTree<T = unknown>(
  tree: NormalizedComment<T>[],
  id: string,
  softDelete = true
): NormalizedComment<T>[] {
  if (softDelete) {
    return updateCommentInTree(tree, id, (node) => ({
      ...node,
      deletedAt: new Date(),
      content: '',
    }));
  }

  return tree
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.replies && node.replies.length > 0) {
        return {
          ...node,
          replies: deleteCommentInTree(node.replies, id, false),
        };
      }
      return node;
    });
}

/**
 * Sorts root comments and their replies recursively.
 */
export function sortCommentTree<T = unknown>(
  tree: NormalizedComment<T>[],
  sortOption: CommentSortOption = 'newest'
): NormalizedComment<T>[] {
  const sorted = [...tree].sort((a, b) => {
    // Pinned comments always stay at the top for root level
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    switch (sortOption) {
      case 'oldest':
        return dateA - dateB;
      case 'mostUpvoted': {
        const reactionsA = (a.reactions || []).reduce((acc, r) => acc + r.count, 0);
        const reactionsB = (b.reactions || []).reduce((acc, r) => acc + r.count, 0);
        if (reactionsB !== reactionsA) {
          return reactionsB - reactionsA;
        }
        return dateB - dateA;
      }
      case 'mostReplies': {
        const repliesA = a.replies?.length || 0;
        const repliesB = b.replies?.length || 0;
        if (repliesB !== repliesA) {
          return repliesB - repliesA;
        }
        return dateB - dateA;
      }
      case 'newest':
      default:
        return dateB - dateA;
    }
  });

  // Sort children replies (replies are typically sorted chronologically oldest first for natural reading)
  return sorted.map((node) => {
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: [...node.replies].sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }),
      };
    }
    return node;
  });
}
