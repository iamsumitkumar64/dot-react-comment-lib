'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import ReplyOutlinedIcon from '@mui/icons-material/ReplyOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { NormalizedComment } from '../types';
import { useCommentContext } from '../context/CommentContext';

export interface CommentActionsProps {
  comment: NormalizedComment;
}

const CommentActionsComponent: React.FC<CommentActionsProps> = ({ comment }) => {
  const {
    currentUser,
    config,
    permissions,
    labels,
    styles,
    classes,
    renderers,
    activeReplyId,
    setActiveReplyId,
    activeEditId,
    setActiveEditId,
    handleDeleteComment,
    handlePinComment,
    handleReportComment,
  } = useCommentContext();

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // If deleted comment, actions shouldn't show
  if (comment.deletedAt) {
    return null;
  }

  // Permission evaluations
  const isAuthor = currentUser?.id === comment.author.id;
  const isAtMaxDepth = comment.depth >= config.maxDepth;

  const canReply =
    config.enableNesting &&
    !isAtMaxDepth &&
    (typeof permissions.canReply === 'function'
      ? permissions.canReply(comment, currentUser)
      : permissions.canReply !== false);

  const canEdit =
    typeof permissions.canEdit === 'function'
      ? permissions.canEdit(comment, currentUser)
      : permissions.canEdit !== undefined
      ? permissions.canEdit
      : isAuthor;

  const canDelete =
    typeof permissions.canDelete === 'function'
      ? permissions.canDelete(comment, currentUser)
      : permissions.canDelete !== undefined
      ? permissions.canDelete
      : isAuthor;

  const canPin =
    typeof permissions.canPin === 'function'
      ? permissions.canPin(comment, currentUser)
      : Boolean(permissions.canPin);

  const canReport =
    typeof permissions.canReport === 'function'
      ? permissions.canReport(comment, currentUser)
      : permissions.canReport !== false && !isAuthor;

  const hasMenuActions = canEdit || canDelete || canPin || canReport;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const onReplyClick = () => {
    if (activeReplyId === comment.id) {
      setActiveReplyId(null);
    } else {
      setActiveReplyId(comment.id);
      setActiveEditId(null);
    }
  };

  const onEditClick = () => {
    handleCloseMenu();
    setActiveEditId(comment.id);
    setActiveReplyId(null);
  };

  const onDeleteClick = () => {
    handleCloseMenu();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteDialogOpen(false);
    await handleDeleteComment(comment.id);
  };

  const onPinClick = () => {
    handleCloseMenu();
    handlePinComment(comment.id);
  };

  const onReportClick = () => {
    handleCloseMenu();
    handleReportComment(comment.id);
  };

  const defaultActions = (
    <Box
      className={classes.actions}
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mt: 0.5,
        },
        styles.actionsContainer,
      ] as any}
    >
      {/* Reply Action */}
      {canReply && (
        <Button
          size="small"
          startIcon={<ReplyOutlinedIcon sx={{ fontSize: 16 }} />}
          onClick={onReplyClick}
          sx={[
            {
              color: activeReplyId === comment.id ? 'primary.main' : 'text.secondary',
              textTransform: 'none',
              fontSize: '0.785rem',
              fontWeight: 600,
              py: 0.25,
              px: 0.75,
              borderRadius: 1.5,
              bgcolor:
                activeReplyId === comment.id ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: 'action.hover',
                color: 'primary.main',
              },
            },
            styles.replyButton,
          ] as any}
        >
          {labels.replyAction}
        </Button>
      )}

      {/* Overflow Menu for Edit, Delete, Pin, Report */}
      {hasMenuActions && (
        <>
          <Tooltip title="More options" arrow>
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              sx={[
                {
                  p: 0.5,
                  color: 'text.secondary',
                  opacity: 0.7,
                  '&:hover': { opacity: 1, color: 'text.primary', bgcolor: 'action.hover' },
                },
                styles.moreMenuButton,
              ] as any}
            >
              <MoreHorizIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                  boxShadow: 4,
                  minWidth: 140,
                  py: 0.5,
                },
              },
            }}
          >
            {canEdit && (
              <MenuItem onClick={onEditClick} dense sx={[styles.editButton] as any}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <EditOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={labels.editAction}
                  slotProps={{ primary: { sx: { fontSize: '0.825rem' } } }}
                />
              </MenuItem>
            )}

            {canPin && (
              <MenuItem onClick={onPinClick} dense sx={[styles.pinButton] as any}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {comment.isPinned ? (
                    <PushPinIcon fontSize="small" color="primary" />
                  ) : (
                    <PushPinOutlinedIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={comment.isPinned ? labels.unpinAction : labels.pinAction}
                  slotProps={{ primary: { sx: { fontSize: '0.825rem' } } }}
                />
              </MenuItem>
            )}

            {canDelete && (
              <MenuItem onClick={onDeleteClick} dense sx={[{ color: 'error.main' }, styles.deleteButton] as any}>
                <ListItemIcon sx={{ minWidth: 28, color: 'error.main' }}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={labels.deleteAction}
                  slotProps={{ primary: { sx: { fontSize: '0.825rem' } } }}
                />
              </MenuItem>
            )}

            {canReport && (
              <MenuItem onClick={onReportClick} dense>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <FlagOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={labels.reportAction}
                  slotProps={{ primary: { sx: { fontSize: '0.825rem' } } }}
                />
              </MenuItem>
            )}
          </Menu>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
          >
            <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
              {labels.confirmDeleteTitle}
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ fontSize: '0.9rem' }}>
                {labels.confirmDeleteBody}
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="inherit"
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {labels.cancelButton}
              </Button>
              <Button
                onClick={confirmDelete}
                variant="contained"
                color="error"
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none' }}
              >
                {labels.deleteAction}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );

  if (renderers.actions) {
    return <>{renderers.actions(comment, defaultActions)}</>;
  }

  return defaultActions;
};

export const CommentActions = React.memo(CommentActionsComponent);
