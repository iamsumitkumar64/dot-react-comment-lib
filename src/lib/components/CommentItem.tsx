'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PushPinIcon from '@mui/icons-material/PushPin';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles';
import { NormalizedComment } from '../types';
import { useCommentContext } from '../context/CommentContext';
import { CommentAvatar } from './CommentAvatar';
import { EmojiReactionPicker } from './EmojiReactionPicker';
import { CommentActions } from './CommentActions';
import { CommentComposer } from './CommentComposer';
import { ThreadConnector } from './ThreadConnector';

export interface CommentItemProps {
  comment: NormalizedComment;
}

const CommentItemComponent: React.FC<CommentItemProps> = ({ comment }) => {
  const {
    config,
    labels,
    styles,
    classes,
    renderers,
    activeReplyId,
    setActiveReplyId,
    activeEditId,
    setActiveEditId,
    isCollapsed,
    toggleCollapse,
    formatDate,
  } = useCommentContext();

  const theme = useTheme();

  const isDeleted = Boolean(comment.deletedAt);
  const isEditing = activeEditId === comment.id;
  const isReplying = activeReplyId === comment.id;
  const hasReplies = Boolean(comment.replies && comment.replies.length > 0);
  const collapsed = isCollapsed(comment.id);

  // If comment is soft-deleted and config says 'hide', don't render anything
  if (isDeleted && config.softDeleteHandling === 'hide') {
    return null;
  }

  const showThreadLine =
    config.enableNesting &&
    config.showThreadLines &&
    hasReplies &&
    !collapsed;

  // Header content
  const defaultHeader = (
    <Box
      className={classes.commentHeader}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          mb: 0.5,
        },
        styles.commentHeader,
      ] as any}
    >
      {/* Author Name */}
      <Typography
        variant="subtitle2"
        className={classes.authorName}
        sx={[
          {
            fontWeight: 600,
            fontSize: '0.875rem',
            color: isDeleted ? 'text.disabled' : 'text.primary',
            lineHeight: 1.2,
          },
          styles.authorName,
        ] as any}
      >
        {isDeleted ? 'Deleted' : comment.author.name}
      </Typography>

      {/* Author Role or Badge */}
      {!isDeleted && (comment.author.role || comment.author.badge) && (
        <Chip
          label={comment.author.role || comment.author.badge}
          size="small"
          className={classes.authorBadge}
          sx={[
            {
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              bgcolor:
                comment.author.role === 'Admin' || comment.author.role === 'Author'
                  ? 'primary.main'
                  : 'action.selected',
              color:
                comment.author.role === 'Admin' || comment.author.role === 'Author'
                  ? 'primary.contrastText'
                  : 'text.secondary',
              borderRadius: '4px',
            },
            styles.authorBadge,
          ] as any}
        />
      )}

      {/* Pinned Tag */}
      {comment.isPinned && !isDeleted && (
        <Box
          sx={[
            {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.25,
              color: 'primary.main',
              fontSize: '0.725rem',
              fontWeight: 600,
            },
            styles.pinnedBadge,
          ] as any}
        >
          <PushPinIcon sx={{ fontSize: 13 }} />
          <span>{labels.pinnedTag}</span>
        </Box>
      )}

      {/* Timestamp */}
      <Typography
        variant="caption"
        sx={[
          {
            color: 'text.disabled',
            fontSize: '0.75rem',
          },
          styles.timestamp,
        ] as any}
      >
        {formatDate(comment.createdAt)}
      </Typography>

      {/* Edited indicator */}
      {comment.updatedAt && !isDeleted && (
        <Typography
          variant="caption"
          sx={[
            {
              color: 'text.disabled',
              fontSize: '0.7rem',
              fontStyle: 'italic',
            },
            styles.editedTag,
          ] as any}
        >
          ({labels.editedTag})
        </Typography>
      )}
    </Box>
  );

  // Body content
  const defaultBody = isDeleted ? (
    <Typography
      variant="body2"
      sx={[
        {
          color: 'text.disabled',
          fontStyle: 'italic',
          fontSize: '0.875rem',
          py: 0.5,
        },
        styles.deletedCommentText,
      ] as any}
    >
      {labels.deletedMessage}
    </Typography>
  ) : (
    <Typography
      variant="body2"
      className={classes.commentBody}
      sx={[
        {
          color: 'text.primary',
          fontSize: '0.9rem',
          lineHeight: 1.55,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        },
        styles.commentBody,
      ] as any}
    >
      {comment.content}
    </Typography>
  );

  return (
    <Box
      className={classes.commentItem}
      sx={[
        {
          position: 'relative',
          mt: 1.5,
          mb: 1.5,
        },
        styles.commentItem,
      ] as any}
    >
      {/* Visual Thread Connector Line on Left */}
      {showThreadLine && (
        <ThreadConnector
          isCollapsed={collapsed}
          onToggleCollapse={() => toggleCollapse(comment.id)}
        />
      )}

      {/* Main Comment Row */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        {/* Avatar */}
        <Box sx={{ pt: 0.25 }}>
          <CommentAvatar
            author={comment.author}
            comment={comment}
            size={comment.depth > 0 ? 30 : 36}
          />
        </Box>

        {/* Comment Content Card */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          {renderers.header ? renderers.header(comment, defaultHeader) : defaultHeader}

          {/* Body / In-place Edit mode */}
          {isEditing ? (
            <CommentComposer
              parentId={comment.id}
              initialValue={comment.content}
              isEdit
              onCancel={() => setActiveEditId(null)}
              onSuccess={() => setActiveEditId(null)}
            />
          ) : renderers.body ? (
            renderers.body(comment, defaultBody)
          ) : (
            defaultBody
          )}

          {/* Emoji Reactions */}
          {!isDeleted && <EmojiReactionPicker comment={comment} />}

          {/* Actions Bar (Reply, Edit, Delete, Pin, Report) */}
          <CommentActions comment={comment} />

          {/* Inline Reply Composer */}
          {isReplying && (
            <CommentComposer
              parentId={comment.id}
              parentComment={comment}
              isReply
              autoFocus
              onCancel={() => setActiveReplyId(null)}
              onSuccess={() => setActiveReplyId(null)}
            />
          )}

          {/* Collapse/Expand Toggle Pill if Comment has replies */}
          {config.enableNesting && hasReplies && config.collapsible && (
            <Box sx={{ mt: 0.75 }}>
              <Button
                size="small"
                variant="text"
                onClick={() => toggleCollapse(comment.id)}
                startIcon={
                  collapsed ? (
                    <ExpandMoreIcon sx={{ fontSize: 16 }} />
                  ) : (
                    <ExpandLessIcon sx={{ fontSize: 16 }} />
                  )
                }
                sx={[
                  {
                    textTransform: 'none',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    color: 'primary.main',
                    py: 0.2,
                    px: 0.75,
                    borderRadius: 1.5,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(144, 202, 249, 0.08)'
                        : 'rgba(25, 118, 210, 0.06)',
                    '&:hover': {
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(144, 202, 249, 0.16)'
                          : 'rgba(25, 118, 210, 0.12)',
                    },
                  },
                  styles.collapseButton,
                ] as any}
              >
                {collapsed
                  ? labels.viewReplies(comment.replies!.length)
                  : labels.hideReplies}
              </Button>
            </Box>
          )}

          {/* Nested Replies Section */}
          {config.enableNesting && hasReplies && (
            <Collapse in={!collapsed} timeout="auto" unmountOnExit={false}>
              <Box
                className={classes.replies}
                sx={[
                  {
                    pl: `${config.indentSize}px`,
                    mt: 0.5,
                  },
                  styles.repliesContainer,
                ] as any}
              >
                {comment.replies!.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} />
                ))}
              </Box>
            </Collapse>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const CommentItem = React.memo(CommentItemComponent);
