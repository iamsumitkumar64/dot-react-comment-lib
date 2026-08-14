'use client';

import { useMemo, useState } from 'react';
import {
  CommentAuthor,
  CommentFieldMapping,
  CommentSortOption,
  NormalizedComment,
} from '../types';
import {
  buildCommentTree,
  deleteCommentInTree,
  insertCommentInTree,
  normalizeComment,
  sortCommentTree,
  updateCommentInTree,
} from '../adapters/schemaAdapter';
import { roomChatSchemaMapping } from '../adapters/roomChatAdapter';

export interface UseCommentTreeOptions<T = Record<string, unknown>> {
  initialData?: T[];
  schema?: CommentFieldMapping<T> | 'room-chat' | 'default';
  enableNesting?: boolean;
  maxDepth?: number;
  sortBy?: CommentSortOption;
  currentUser?: CommentAuthor;
}

export function useCommentTree<T = Record<string, unknown>>({
  initialData = [],
  schema,
  enableNesting = true,
  maxDepth = Infinity,
  sortBy = 'newest',
  currentUser,
}: UseCommentTreeOptions<T>) {
  // Resolve schema mapping
  const fieldMapping = useMemo(() => {
    if (schema === 'room-chat') {
      return roomChatSchemaMapping as unknown as CommentFieldMapping<T>;
    }
    if (schema === 'default' || !schema) {
      return undefined;
    }
    return schema;
  }, [schema]);

  // Convert raw initial data into NormalizedComment tree
  const initialTree = useMemo(() => {
    const normalized = initialData.map((item) =>
      normalizeComment(item, fieldMapping, 0)
    );
    if (!enableNesting) {
      return normalized;
    }
    return buildCommentTree(normalized, maxDepth);
  }, [initialData, fieldMapping, enableNesting, maxDepth]);

  const [tree, setTree] = useState<NormalizedComment<T>[]>(initialTree);
  const [currentSort, setCurrentSort] = useState<CommentSortOption>(sortBy);

  // Sorted tree
  const sortedTree = useMemo(() => {
    return sortCommentTree(tree, currentSort);
  }, [tree, currentSort]);

  // Add comment / reply
  const addComment = (
    content: string,
    parentId: string | null = null,
    author: CommentAuthor = currentUser || {
      id: 'anonymous',
      name: 'Anonymous',
    }
  ): NormalizedComment<T> => {
    const newComment: NormalizedComment<T> = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      parentId,
      content,
      createdAt: new Date(),
      author,
      reactions: [],
      depth: 0,
      replies: [],
    };

    setTree((prev) => insertCommentInTree(prev, newComment, parentId));
    return newComment;
  };

  // Edit comment
  const editComment = (id: string, newContent: string) => {
    setTree((prev) =>
      updateCommentInTree(prev, id, (c) => ({
        ...c,
        content: newContent,
        updatedAt: new Date(),
      }))
    );
  };

  // Delete comment
  const deleteComment = (id: string, softDelete = true) => {
    setTree((prev) => deleteCommentInTree(prev, id, softDelete));
  };

  // React to comment
  const reactToComment = (id: string, emoji: string, user: CommentAuthor = currentUser || { id: 'current', name: 'You' }) => {
    setTree((prev) =>
      updateCommentInTree(prev, id, (c) => {
        const reactions = [...(c.reactions || [])];
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

        if (existingIdx >= 0) {
          const r = reactions[existingIdx];
          const hasReacted = r.hasReacted;
          if (hasReacted) {
            // Remove user reaction
            const newCount = r.count - 1;
            if (newCount <= 0) {
              reactions.splice(existingIdx, 1);
            } else {
              reactions[existingIdx] = {
                ...r,
                count: newCount,
                hasReacted: false,
                users: (r.users || []).filter((u) => (typeof u === 'string' ? u !== user.id : u.id !== user.id)),
              };
            }
          } else {
            // Add user reaction
            reactions[existingIdx] = {
              ...r,
              count: r.count + 1,
              hasReacted: true,
              users: [...(r.users || []), user],
            };
          }
        } else {
          // New emoji reaction
          reactions.push({
            emoji,
            count: 1,
            hasReacted: true,
            users: [user],
          });
        }

        return { ...c, reactions };
      })
    );
  };

  // Pin comment
  const pinComment = (id: string) => {
    setTree((prev) =>
      updateCommentInTree(prev, id, (c) => ({
        ...c,
        isPinned: !c.isPinned,
      }))
    );
  };

  // Total comment count (recursively counted)
  const totalComments = useMemo(() => {
    function count(nodes: NormalizedComment<T>[]): number {
      return nodes.reduce(
        (acc, node) => acc + 1 + (node.replies ? count(node.replies) : 0),
        0
      );
    }
    return count(tree);
  }, [tree]);

  return {
    comments: sortedTree,
    rawTree: tree,
    setTree,
    sortBy: currentSort,
    setSortBy: setCurrentSort,
    addComment,
    editComment,
    deleteComment,
    reactToComment,
    pinComment,
    totalComments,
  };
}
