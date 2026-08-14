'use client';

import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import { useTheme } from '@mui/material/styles';
import { CommentSortOption } from '../types';
import { useCommentContext } from '../context/CommentContext';
import { CommentComposer } from './CommentComposer';
import { CommentItem } from './CommentItem';

export const CommentList: React.FC = () => {
  const {
    comments,
    config,
    labels,
    styles,
    classes,
    renderers,
    sortBy,
    setSortBy,
  } = useCommentContext();

  const theme = useTheme();

  const handleSortChange = (event: SelectChangeEvent<CommentSortOption>) => {
    setSortBy(event.target.value as CommentSortOption);
  };

  // Calculate total comments
  const countComments = (list: typeof comments): number => {
    return list.reduce(
      (acc, c) => acc + 1 + (c.replies ? countComments(c.replies) : 0),
      0
    );
  };

  const totalCount = countComments(comments);

  const showTopComposer =
    config.composerPosition === 'top' || config.composerPosition === 'both';
  const showBottomComposer =
    config.composerPosition === 'bottom' || config.composerPosition === 'both';

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Bar */}
      <Box
        className={classes.header}
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1.5,
            mb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          },
          styles.header,
        ] as any}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            className={classes.title}
            sx={[
              {
                fontWeight: 700,
                fontSize: '1.15rem',
                letterSpacing: '-0.01em',
              },
              styles.title,
            ] as any}
          >
            {labels.title}
          </Typography>
          <Typography
            variant="body2"
            className={classes.countBadge}
            sx={[
              {
                fontWeight: 600,
                color: 'text.secondary',
                bgcolor: 'action.hover',
                px: 1,
                py: 0.2,
                borderRadius: 3,
                fontSize: '0.75rem',
              },
              styles.countBadge,
            ] as any}
          >
            {totalCount}
          </Typography>
        </Box>

        {/* Sort Control */}
        {config.showSortControl && (
          <FormControl size="small" sx={[styles.sortSelect] as any}>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              displayEmpty
              renderValue={(val) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SortRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {val === 'newest'
                      ? labels.sortNewest
                      : val === 'oldest'
                      ? labels.sortOldest
                      : labels.sortPopular}
                  </Typography>
                </Box>
              )}
              sx={{
                borderRadius: 2,
                fontSize: '0.8rem',
                '& .MuiSelect-select': {
                  py: 0.5,
                  pr: '28px !important',
                },
              }}
            >
              <MenuItem value="newest" dense>
                {labels.sortNewest}
              </MenuItem>
              <MenuItem value="oldest" dense>
                {labels.sortOldest}
              </MenuItem>
              <MenuItem value="mostUpvoted" dense>
                {labels.sortPopular}
              </MenuItem>
              <MenuItem value="mostReplies" dense>
                Most replies
              </MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Top Composer */}
      {showTopComposer && <CommentComposer />}

      {/* Comment Items or Empty State */}
      {comments.length === 0 ? (
        renderers.emptyState ? (
          <>{renderers.emptyState()}</>
        ) : (
          <Box
            className={classes.emptyState}
            sx={[
              {
                py: 6,
                px: 2,
                textAlign: 'center',
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.01)',
                borderRadius: 3,
                border: '1px dashed',
                borderColor: 'divider',
                my: 2,
              },
              styles.emptyState,
            ] as any}
          >
            <ChatBubbleOutlineRoundedIcon
              sx={{ fontSize: 40, color: 'text.disabled', mb: 1, opacity: 0.6 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {labels.noComments}
            </Typography>
          </Box>
        )
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </Box>
      )}

      {/* Bottom Composer */}
      {showBottomComposer && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <CommentComposer />
        </Box>
      )}
    </Box>
  );
};
