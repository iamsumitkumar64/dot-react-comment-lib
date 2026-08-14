'use client';

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import {
  CommentAuthor,
  CommentClassNames,
  CommentCustomRenderers,
  CommentCustomStyles,
  CommentLabels,
  CommentPermissions,
  CommentSortOption,
  NestedCommentsConfig,
  NormalizedComment,
} from '../types';
import { defaultLabels } from '../utils/defaultLabels';
import { formatRelativeTime } from '../utils/dateFormatter';

export interface CommentContextValue<T = unknown> {
  // Data & Users
  comments: NormalizedComment<T>[];
  currentUser?: CommentAuthor;
  
  // Configuration & Styling
  config: Required<NestedCommentsConfig>;
  permissions: CommentPermissions<T>;
  labels: CommentLabels;
  renderers: CommentCustomRenderers<T>;
  styles: CommentCustomStyles;
  classes: CommentClassNames;
  
  // State
  sortBy: CommentSortOption;
  setSortBy: (sort: CommentSortOption) => void;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  activeEditId: string | null;
  setActiveEditId: (id: string | null) => void;
  collapsedIds: Set<string>;
  toggleCollapse: (id: string) => void;
  isCollapsed: (id: string) => boolean;

  // Actions
  handleSubmitComment: (content: string, parentId?: string | null) => Promise<boolean>;
  handleEditComment: (id: string, content: string) => Promise<boolean>;
  handleDeleteComment: (id: string) => Promise<boolean>;
  handleReactComment: (id: string, emoji: string) => Promise<boolean>;
  handlePinComment: (id: string) => Promise<boolean>;
  handleReportComment: (id: string) => Promise<boolean>;
  
  // Formatters
  formatDate: (date: Date | string | number) => string;
}

const CommentContext = createContext<CommentContextValue<any> | null>(null);

export const defaultConfig: Required<NestedCommentsConfig> = {
  enableNesting: true,
  maxDepth: Infinity,
  indentSize: 28,
  showAvatars: true,
  avatarShape: 'circle',
  showThreadLines: true,
  collapsible: true,
  defaultExpanded: true,
  enableReactions: true,
  quickReactions: ['👍', '❤️', '🔥', '🎉', '🚀', '👀'],
  enableEmojiPicker: true,
  softDeleteHandling: 'placeholder',
  composerPosition: 'top',
  showSortControl: true,
  sortBy: 'newest',
  minContentLength: 1,
  maxContentLength: 5000,
  autoFocusOnReply: true,
};

export interface CommentProviderProps<T = unknown> {
  children: React.ReactNode;
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
  onSubmitComment?: (data: { content: string; parentId: string | null; parentComment?: NormalizedComment<T> }) => Promise<void> | void;
  onEditComment?: (data: { id: string; content: string; comment: NormalizedComment<T> }) => Promise<void> | void;
  onDeleteComment?: (data: { id: string; comment: NormalizedComment<T> }) => Promise<void> | void;
  onReactComment?: (data: { id: string; emoji: string; comment: NormalizedComment<T>; action: 'add' | 'remove' }) => Promise<void> | void;
  onPinComment?: (data: { id: string; isPinned: boolean; comment: NormalizedComment<T> }) => Promise<void> | void;
  onReportComment?: (data: { id: string; comment: NormalizedComment<T> }) => Promise<void> | void;
}

export function CommentProvider<T = unknown>({
  children,
  comments,
  currentUser,
  config: userConfig,
  permissions = {},
  labels: userLabels,
  styles = {},
  classes = {},
  renderers = {},
  formatDate = formatRelativeTime,
  sortBy: controlledSortBy,
  onSortChange,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
  onReactComment,
  onPinComment,
  onReportComment,
}: CommentProviderProps<T>) {
  const mergedConfig = useMemo(() => ({
    ...defaultConfig,
    ...userConfig,
  }), [userConfig]);

  const mergedLabels = useMemo(() => ({
    ...defaultLabels,
    ...userLabels,
  }), [userLabels]);

  const [internalSortBy, setInternalSortBy] = useState<CommentSortOption>(
    controlledSortBy || mergedConfig.sortBy
  );

  const currentSort = controlledSortBy || internalSortBy;

  const handleSortChange = useCallback((newSort: CommentSortOption) => {
    setInternalSortBy(newSort);
    onSortChange?.(newSort);
  }, [onSortChange]);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isCollapsed = useCallback((id: string) => {
    if (!mergedConfig.collapsible) return false;
    const explicitlyCollapsed = collapsedIds.has(id);
    return mergedConfig.defaultExpanded ? explicitlyCollapsed : !explicitlyCollapsed;
  }, [mergedConfig.collapsible, mergedConfig.defaultExpanded, collapsedIds]);

  // Helper to find normalized comment by ID
  const findComment = useCallback((id: string): NormalizedComment<T> | undefined => {
    function search(items: NormalizedComment<T>[]): NormalizedComment<T> | undefined {
      for (const item of items) {
        if (item.id === id) return item;
        if (item.replies) {
          const res = search(item.replies);
          if (res) return res;
        }
      }
      return undefined;
    }
    return search(comments);
  }, [comments]);

  const handleSubmitComment = useCallback(async (content: string, parentId: string | null = null): Promise<boolean> => {
    try {
      const parentComment = parentId ? findComment(parentId) : undefined;
      await onSubmitComment?.({ content, parentId, parentComment });
      setActiveReplyId(null);
      return true;
    } catch (err) {
      console.error('[birwal-react-comment-lib] Error submitting comment:', err);
      return false;
    }
  }, [findComment, onSubmitComment]);

  const handleEditComment = useCallback(async (id: string, content: string): Promise<boolean> => {
    try {
      const comment = findComment(id);
      if (!comment) return false;
      await onEditComment?.({ id, content, comment });
      setActiveEditId(null);
      return true;
    } catch (err) {
      console.error('[birwal-react-comment-lib] Error editing comment:', err);
      return false;
    }
  }, [findComment, onEditComment]);

  const handleDeleteComment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const comment = findComment(id);
      if (!comment) return false;
      await onDeleteComment?.({ id, comment });
      return true;
    } catch (err) {
      console.error('[birwal-react-comment-lib] Error deleting comment:', err);
      return false;
    }
  }, [findComment, onDeleteComment]);

  const handleReactComment = useCallback(async (id: string, emoji: string): Promise<boolean> => {
    try {
      const comment = findComment(id);
      if (!comment) return false;
      const currentReaction = comment.reactions?.find((r) => r.emoji === emoji);
      const action = currentReaction?.hasReacted ? 'remove' : 'add';
      await onReactComment?.({ id, emoji, comment, action });
      return true;
    } catch (err) {
      console.error('[birwal-react-comment-lib] Error reacting to comment:', err);
      return false;
    }
  }, [findComment, onReactComment]);

  const handlePinComment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const comment = findComment(id);
      if (!comment) return false;
      await onPinComment?.({ id, isPinned: !comment.isPinned, comment });
      return true;
    } catch (err) {
      console.error('[birwal-react-comment-lib] Error pinning comment:', err);
      return false;
    }
  }, [findComment, onPinComment]);

  const handleReportComment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const comment = findComment(id);
      if (!comment) return false;
      await onReportComment?.({ id, comment });
      return true;
    } catch (err) {
      console.error('[birwal-react-comment-lib] Error reporting comment:', err);
      return false;
    }
  }, [findComment, onReportComment]);

  const contextValue: CommentContextValue<T> = useMemo(() => ({
    comments,
    currentUser,
    config: mergedConfig,
    permissions,
    labels: mergedLabels,
    styles,
    classes,
    renderers,
    sortBy: currentSort,
    setSortBy: handleSortChange,
    activeReplyId,
    setActiveReplyId,
    activeEditId,
    setActiveEditId,
    collapsedIds,
    toggleCollapse,
    isCollapsed,
    handleSubmitComment,
    handleEditComment,
    handleDeleteComment,
    handleReactComment,
    handlePinComment,
    handleReportComment,
    formatDate,
  }), [
    comments,
    currentUser,
    mergedConfig,
    permissions,
    mergedLabels,
    styles,
    classes,
    renderers,
    currentSort,
    handleSortChange,
    activeReplyId,
    activeEditId,
    collapsedIds,
    toggleCollapse,
    isCollapsed,
    handleSubmitComment,
    handleEditComment,
    handleDeleteComment,
    handleReactComment,
    handlePinComment,
    handleReportComment,
    formatDate,
  ]);

  return (
    <CommentContext.Provider value={contextValue}>
      {children}
    </CommentContext.Provider>
  );
}

export function useCommentContext<T = unknown>(): CommentContextValue<T> {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentContext must be used within a <CommentProvider>');
  }
  return context as CommentContextValue<T>;
}
