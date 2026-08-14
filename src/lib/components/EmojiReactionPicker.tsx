'use client';

import React, { useState, useCallback, Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import { NormalizedComment } from '../types';
import { useCommentContext } from '../context/CommentContext';

// Lazy load emoji-picker-react so it is only loaded on demand (saves ~300KB initial bundle!)
const EmojiPickerLazy = lazy(() => import('emoji-picker-react'));

export interface EmojiReactionPickerProps {
  comment: NormalizedComment;
}

const EmojiReactionPickerComponent: React.FC<EmojiReactionPickerProps> = ({ comment }) => {
  const { config, permissions, currentUser, styles, classes, handleReactComment } = useCommentContext();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  if (!config.enableReactions) {
    return null;
  }

  // Permission check
  const canReact =
    typeof permissions.canReact === 'function'
      ? permissions.canReact(comment, currentUser)
      : permissions.canReact !== false;

  const handleOpenPicker = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClosePicker = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEmojiClick = useCallback((emojiData: { emoji: string }) => {
    handleReactComment(comment.id, emojiData.emoji);
    handleClosePicker();
  }, [comment.id, handleReactComment, handleClosePicker]);

  const handleQuickReaction = useCallback((emoji: string) => {
    handleReactComment(comment.id, emoji);
  }, [comment.id, handleReactComment]);

  const isPickerOpen = Boolean(anchorEl);
  const reactions = comment.reactions || [];

  return (
    <Box
      className={classes.reactions}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.75,
        mt: 0.75,
        ...styles.reactionsContainer,
      }}
    >
      {/* Existing Reaction Chips */}
      {reactions.map((reaction) => {
        const hasReacted = reaction.hasReacted;
        const usersList = (reaction.users || [])
          .map((u) => (typeof u === 'string' ? u : u.name))
          .join(', ');

        return (
          <Tooltip
            key={reaction.emoji}
            title={usersList ? `${usersList} reacted` : reaction.emoji}
            arrow
          >
            <Chip
              size="small"
              clickable={canReact}
              onClick={() => canReact && handleQuickReaction(reaction.emoji)}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{reaction.emoji}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{reaction.count}</span>
                </Box>
              }
              sx={[
                {
                  height: 26,
                  borderRadius: '13px',
                  border: '1px solid',
                  borderColor: hasReacted ? 'primary.main' : 'divider',
                  bgcolor: hasReacted
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(144, 202, 249, 0.15)'
                      : 'rgba(25, 118, 210, 0.08)'
                    : 'background.paper',
                  color: hasReacted ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.15s ease-in-out',
                  '&:hover': canReact
                    ? {
                        borderColor: 'primary.main',
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(144, 202, 249, 0.25)'
                            : 'rgba(25, 118, 210, 0.15)',
                      }
                    : undefined,
                },
                styles.reactionChip,
                hasReacted && styles.activeReactionChip,
              ] as any}
            />
          </Tooltip>
        );
      })}

      {/* Quick Reaction buttons & Full Picker Trigger */}
      {canReact && config.enableEmojiPicker && (
        <>
          <Tooltip title="Add reaction" arrow>
            <IconButton
              size="small"
              onClick={handleOpenPicker}
              sx={[
                {
                  width: 26,
                  height: 26,
                  color: 'text.secondary',
                  border: '1px dashed',
                  borderColor: 'divider',
                  opacity: reactions.length > 0 ? 0.8 : 0.6,
                  '&:hover': {
                    opacity: 1,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                },
                styles.addReactionButton,
              ] as any}
            >
              <AddReactionOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Popover
            open={isPickerOpen}
            anchorEl={anchorEl}
            onClose={handleClosePicker}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 3,
                  boxShadow: theme.shadows[8],
                  overflow: 'hidden',
                  p: 0,
                },
              },
            }}
          >
            {/* Quick reaction top bar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                p: 1,
                bgcolor: 'background.default',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              {config.quickReactions.map((emoji) => (
                <IconButton
                  key={emoji}
                  size="small"
                  onClick={() => {
                    handleQuickReaction(emoji);
                    handleClosePicker();
                  }}
                  sx={{
                    fontSize: '1.25rem',
                    p: 0.5,
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: 'action.hover', transform: 'scale(1.2)' },
                    transition: 'transform 0.1s ease',
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>

            {/* Lazy Loaded Full Emoji Picker */}
            <Suspense
              fallback={
                <Box sx={{ width: 320, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={24} />
                </Box>
              }
            >
              {isPickerOpen && (
                <EmojiPickerLazy
                  onEmojiClick={handleEmojiClick}
                  theme={theme.palette.mode === 'dark' ? ('dark' as any) : ('light' as any)}
                  lazyLoadEmojis
                  searchPlaceHolder="Search emoji..."
                  width={320}
                  height={380}
                />
              )}
            </Suspense>
          </Popover>
        </>
      )}
    </Box>
  );
};

export const EmojiReactionPicker = React.memo(EmojiReactionPickerComponent);
