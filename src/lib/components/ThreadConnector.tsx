'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useCommentContext } from '../context/CommentContext';

export interface ThreadConnectorProps {
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

const ThreadConnectorComponent: React.FC<ThreadConnectorProps> = ({
  onToggleCollapse,
}) => {
  const { styles, classes } = useCommentContext();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onClick={onToggleCollapse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={classes.threadLine}
      sx={{
        position: 'absolute',
        left: 18,
        top: 44,
        bottom: 0,
        width: 16,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1,
        '&:hover .thread-line': {
          bgcolor: 'primary.main',
          width: '2.5px',
        },
      }}
    >
      <Box
        className="thread-line"
        sx={[
          {
            width: '1.5px',
            height: '100%',
            bgcolor: isHovered
              ? 'primary.main'
              : theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.1)',
            transition: 'all 0.15s ease',
            borderRadius: '1px',
          },
          styles.threadLine,
        ] as any}
      />
    </Box>
  );
};

export const ThreadConnector = React.memo(ThreadConnectorComponent);
