'use client';

import React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { CommentAuthor, NormalizedComment } from '../types';
import { getInitials, stringToColor } from '../utils/avatarUtils';
import { useCommentContext } from '../context/CommentContext';

export interface CommentAvatarProps {
  author: CommentAuthor;
  comment?: NormalizedComment;
  size?: number;
}

const CommentAvatarComponent: React.FC<CommentAvatarProps> = ({
  author,
  comment,
  size = 36,
}) => {
  const { config, styles, classes, renderers } = useCommentContext();

  // If business rule hides avatars completely
  if (!config.showAvatars) {
    return null;
  }

  // Custom avatar renderer slot
  if (renderers.avatar && comment) {
    return <>{renderers.avatar(author, comment)}</>;
  }

  const borderRadius =
    config.avatarShape === 'square'
      ? '4px'
      : config.avatarShape === 'rounded'
      ? '8px'
      : '50%';

  const initials = getInitials(author.name);
  const bgColor = stringToColor(author.name || author.id);

  return (
    <Box
      className={classes.avatar}
      sx={[
        {
          position: 'relative',
          display: 'inline-flex',
          flexShrink: 0,
        },
        styles.avatar,
      ] as any}
    >
      <Avatar
        src={author.avatarUrl || undefined}
        alt={author.name}
        sx={{
          width: size,
          height: size,
          borderRadius,
          fontSize: size * 0.4,
          fontWeight: 600,
          bgcolor: author.avatarUrl ? 'transparent' : bgColor,
          color: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          transition: 'transform 0.15s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        {!author.avatarUrl && initials}
      </Avatar>
    </Box>
  );
};

export const CommentAvatar = React.memo(CommentAvatarComponent);
