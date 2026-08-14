'use client';

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import { NestedCommentsProps, CommentFieldMapping } from '../types';
import {
  buildCommentTree,
  normalizeComment,
  sortCommentTree,
} from '../adapters/schemaAdapter';
import { roomChatSchemaMapping } from '../adapters/roomChatAdapter';
import { CommentProvider } from '../context/CommentContext';
import { CommentList } from './CommentList';

export function NestedComments<T = Record<string, unknown>>({
  comments: rawComments = [],
  schema,
  currentUser,
  config,
  permissions,
  labels,
  styles = {},
  classes = {},
  renderers,
  onSubmitComment,
  onEditComment,
  onDeleteComment,
  onReactComment,
  onPinComment,
  onReportComment,
  onSortChange,
  formatDate,
  className,
  sx,
}: NestedCommentsProps<T>) {
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

  const enableNesting = config?.enableNesting !== false;
  const maxDepth = config?.maxDepth ?? Infinity;
  const sortBy = config?.sortBy ?? 'newest';

  // Normalize raw data into tree or flat list
  const normalizedTree = useMemo(() => {
    const normalizedList = rawComments.map((item) =>
      normalizeComment(item, fieldMapping, 0)
    );

    if (!enableNesting) {
      return sortCommentTree(normalizedList, sortBy);
    }

    const tree = buildCommentTree(normalizedList, maxDepth);
    return sortCommentTree(tree, sortBy);
  }, [rawComments, fieldMapping, enableNesting, maxDepth, sortBy]);

  const combinedClass = [className, classes.root].filter(Boolean).join(' ') || undefined;

  return (
    <Box
      className={combinedClass}
      sx={[
        {
          width: '100%',
          maxWidth: 800,
          mx: 'auto',
          fontFamily: 'inherit',
        },
        ...(Array.isArray(styles.root) ? styles.root : styles.root ? [styles.root] : []),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ] as any}
    >
      <CommentProvider
        comments={normalizedTree}
        currentUser={currentUser}
        config={config}
        permissions={permissions}
        labels={labels}
        styles={styles}
        classes={classes}
        renderers={renderers}
        formatDate={formatDate}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onSubmitComment={onSubmitComment}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
        onReactComment={onReactComment}
        onPinComment={onPinComment}
        onReportComment={onReportComment}
      >
        <CommentList />
      </CommentProvider>
    </Box>
  );
}
