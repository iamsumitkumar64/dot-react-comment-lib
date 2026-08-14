'use client';

import React, { useRef, useState, useCallback, Suspense, lazy } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { CommentAuthor, NormalizedComment } from '../types';
import { useCommentContext } from '../context/CommentContext';
import { CommentAvatar } from './CommentAvatar';

// Lazy load emoji-picker-react for blazing fast composer load
const EmojiPickerLazy = lazy(() => import('emoji-picker-react'));

export interface CommentComposerProps {
  parentId?: string | null;
  parentComment?: NormalizedComment;
  placeholder?: string;
  isReply?: boolean;
  initialValue?: string;
  isEdit?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
  autoFocus?: boolean;
}

const CommentComposerComponent: React.FC<CommentComposerProps> = ({
  parentId = null,
  parentComment,
  placeholder,
  isReply = false,
  initialValue = '',
  isEdit = false,
  onCancel,
  onSuccess,
  autoFocus,
}) => {
  const {
    currentUser,
    config,
    labels,
    styles,
    classes,
    renderers,
    handleSubmitComment,
    handleEditComment,
  } = useCommentContext();

  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Validation Schema via Zod
  const commentSchema = z.object({
    content: z
      .string()
      .trim()
      .min(config.minContentLength, labels.validationRequired)
      .max(config.maxContentLength, labels.validationMaxLength(config.maxContentLength)),
  });

  type CommentFormData = z.infer<typeof commentSchema>;

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialValue,
    },
    mode: 'onChange',
  });

  const contentValue = watch('content') || '';

  // Custom composer renderer slot
  if (renderers.composer) {
    return (
      <>
        {renderers.composer({
          parentId,
          placeholder,
          isReply,
          onSubmit: async (text) => {
            if (isEdit && parentId) {
              const ok = await handleEditComment(parentId, text);
              if (ok) onSuccess?.();
              return ok;
            }
            const ok = await handleSubmitComment(text, parentId);
            if (ok) onSuccess?.();
            return ok;
          },
          onCancel,
          autoFocus,
        })}
      </>
    );
  }

  const defaultPlaceholder = isReply
    ? labels.writeReplyPlaceholder
    : labels.writeCommentPlaceholder;

  const onFormSubmit = async (data: CommentFormData) => {
    try {
      setIsSubmitting(true);
      let success = false;
      if (isEdit && parentId) {
        success = await handleEditComment(parentId, data.content);
      } else {
        success = await handleSubmitComment(data.content, parentId);
      }

      if (success) {
        reset({ content: '' });
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEmoji = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  }, []);

  const handleCloseEmoji = useCallback(() => {
    setEmojiAnchorEl(null);
  }, []);

  const handleInsertEmoji = useCallback((emojiData: { emoji: string }) => {
    const current = getValues('content') || '';
    const cursor = textareaRef.current?.selectionStart ?? current.length;
    const updated =
      current.substring(0, cursor) + emojiData.emoji + current.substring(cursor);
    setValue('content', updated, { shouldValidate: true, shouldDirty: true });
    handleCloseEmoji();

    // Re-focus and set cursor position after emoji
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const nextCursor = cursor + emojiData.emoji.length;
        textareaRef.current.setSelectionRange(nextCursor, nextCursor);
      }
    }, 50);
  }, [getValues, setValue, handleCloseEmoji]);

  const authorForAvatar: CommentAuthor = currentUser || {
    id: 'current-user',
    name: 'You',
  };

  return (
    <Box
      component="form"
      className={classes.composer}
      onSubmit={handleSubmit(onFormSubmit)}
      sx={[
        {
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-start',
          width: '100%',
          mt: isReply || isEdit ? 1.5 : 0,
          mb: isReply || isEdit ? 1.5 : 2.5,
        },
        styles.composer,
      ] as any}
    >
      {/* User avatar on composer (unless hidden or in pure edit mode) */}
      {!isEdit && config.showAvatars && (
        <Box sx={{ pt: 0.5 }}>
          <CommentAvatar author={authorForAvatar} size={36} />
        </Box>
      )}

      {/* Main input container */}
      <Box
        sx={[
          {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: errors.content
              ? 'error.main'
              : theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.12)'
              : 'rgba(0, 0, 0, 0.12)',
            borderRadius: 2.5,
            p: 1.5,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:focus-within': {
              borderColor: errors.content ? 'error.main' : 'primary.main',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 0 0 2px rgba(144, 202, 249, 0.2)'
                  : '0 0 0 2px rgba(25, 118, 210, 0.15)',
            },
          },
          styles.composerInput,
        ] as any}
      >
        {/* Reply target banner if replying */}
        {isReply && parentComment && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 0.75,
              mb: 0.75,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Replying to <strong>@{parentComment.author.name}</strong>
            </Typography>
            {onCancel && (
              <IconButton size="small" onClick={onCancel} sx={{ p: 0.25 }}>
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        )}

        {/* Input Text Area */}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputRef={(el) => {
                textareaRef.current = el;
                field.ref(el);
              }}
              multiline
              minRows={isReply || isEdit ? 2 : 3}
              maxRows={10}
              fullWidth
              autoFocus={autoFocus ?? (isReply || isEdit)}
              placeholder={placeholder || defaultPlaceholder}
              variant="standard"
              disabled={isSubmitting}
              slotProps={{
                input: {
                  disableUnderline: true,
                  sx: {
                    fontSize: '0.925rem',
                    lineHeight: 1.5,
                    p: 0,
                  },
                },
              }}
            />
          )}
        />

        {/* Error message */}
        {errors.content && (
          <Typography
            variant="caption"
            color="error.main"
            sx={{ mt: 0.75, fontWeight: 500 }}
          >
            {errors.content.message}
          </Typography>
        )}

        {/* Bottom Toolbar */}
        <Box
          sx={[
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            },
            styles.composerToolbar,
          ] as any}
        >
          {/* Left tools: Emoji Picker */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {config.enableEmojiPicker && (
              <Tooltip title="Insert emoji" arrow>
                <IconButton
                  size="small"
                  onClick={handleOpenEmoji}
                  disabled={isSubmitting}
                  sx={[
                    {
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
                    },
                    styles.composerEmojiButton,
                  ] as any}
                >
                  <SentimentSatisfiedAltOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            )}

            {/* Character limit counter */}
            {config.maxContentLength && config.maxContentLength < 10000 && (
              <Typography
                variant="caption"
                sx={{
                  ml: 1,
                  color:
                    contentValue.length > config.maxContentLength * 0.9
                      ? 'error.main'
                      : 'text.disabled',
                  fontSize: '0.75rem',
                }}
              >
                {contentValue.length}/{config.maxContentLength}
              </Typography>
            )}
          </Box>

          {/* Right actions: Cancel + Submit Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {(isReply || isEdit || onCancel) && (
              <Button
                size="small"
                variant="text"
                color="inherit"
                disabled={isSubmitting}
                onClick={onCancel}
                sx={[
                  {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    borderRadius: 2,
                    px: 1.5,
                  },
                  styles.composerCancelButton,
                ] as any}
              >
                {labels.cancelButton}
              </Button>
            )}

            <Button
              type="submit"
              size="small"
              variant="contained"
              disabled={isSubmitting || !contentValue.trim()}
              endIcon={
                isSubmitting ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <SendRoundedIcon sx={{ fontSize: 16 }} />
                )
              }
              sx={[
                {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderRadius: 2,
                  px: 2,
                  py: 0.6,
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
                },
                styles.composerSubmitButton,
              ] as any}
            >
              {isEdit
                ? labels.saveButton
                : isReply
                ? labels.replyButton
                : labels.postButton}
            </Button>
          </Box>
        </Box>

        {/* Lazy Loaded Emoji Popover */}
        <Popover
          open={Boolean(emojiAnchorEl)}
          anchorEl={emojiAnchorEl}
          onClose={handleCloseEmoji}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                boxShadow: theme.shadows[8],
                overflow: 'hidden',
              },
            },
          }}
        >
          <Suspense
            fallback={
              <Box sx={{ width: 320, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} />
              </Box>
            }
          >
            {Boolean(emojiAnchorEl) && (
              <EmojiPickerLazy
                onEmojiClick={handleInsertEmoji}
                theme={theme.palette.mode === 'dark' ? ('dark' as any) : ('light' as any)}
                lazyLoadEmojis
                searchPlaceHolder="Search emoji..."
                width={320}
                height={380}
              />
            )}
          </Suspense>
        </Popover>
      </Box>
    </Box>
  );
};

export const CommentComposer = React.memo(CommentComposerComponent);
