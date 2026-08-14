'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Chip,
  IconButton,
  Button,
  Divider,
  Alert,
  Tooltip,
} from '@mui/material';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import PaletteRoundedIcon from '@mui/icons-material/PaletteRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import {
  NestedComments,
  CommentAuthor,
  CommentFieldMapping,
  CommentSortOption,
  CommentCustomStyles,
} from '../lib';

// Sample Authors
const sampleUsers: Record<string, CommentAuthor> = {
  admin: {
    id: 'usr-1',
    name: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Admin',
    email: 'aarav@company.com',
  },
  author: {
    id: 'usr-2',
    name: 'Priya Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Author',
    email: 'priya@company.com',
  },
  member: {
    id: 'usr-3',
    name: 'Rohan Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
  },
  guest: {
    id: 'usr-4',
    name: 'Guest Viewer',
    role: 'Guest',
  },
};

// 1. RoomChatEntity format (matching TypeORM chat-db.entity.ts with fixed ISO timestamps)
const initialRoomChatData = [
  {
    uuid: '101',
    message_parent_uuid: null,
    message: 'Welcome to the threaded comments component! You can customize this to fit any database schema, including RoomChatEntity with uuid and message_parent_uuid. 🚀',
    created_at: '2025-02-14T06:00:00.000Z',
    author_id: 'usr-1',
    author_name: 'Aarav Sharma',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_role: 'Admin',
    reactions: [
      { emoji: '🔥', count: 6, hasReacted: true, users: ['Aarav Sharma', 'Priya Patel'] },
      { emoji: '👏', count: 3, hasReacted: false, users: ['Rohan Mehta'] },
    ],
    is_pinned: true,
  },
  {
    uuid: '102',
    message_parent_uuid: '101',
    message: 'This works directly with flat database rows and builds the nested tree hierarchy automatically on the fly!',
    created_at: '2025-02-14T07:30:00.000Z',
    author_id: 'usr-2',
    author_name: 'Priya Patel',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    author_role: 'Author',
    reactions: [
      { emoji: '❤️', count: 4, hasReacted: true, users: ['Priya Patel'] },
    ],
  },
  {
    uuid: '103',
    message_parent_uuid: '102',
    message: 'And business rules like showing/hiding images, max nesting depth, and flat mode are fully configurable via props. Try the toggles on the right panel!',
    created_at: '2025-02-14T08:45:00.000Z',
    author_id: 'usr-3',
    author_name: 'Rohan Mehta',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    author_role: 'Member',
    reactions: [{ emoji: '🎉', count: 2, hasReacted: false }],
  },
  {
    uuid: '104',
    message_parent_uuid: '103',
    message: 'Notice the visual connector lines, emoji picker integration, and soft-delete support.',
    created_at: '2025-02-14T09:15:00.000Z',
    author_id: 'usr-1',
    author_name: 'Aarav Sharma',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_role: 'Admin',
  },
  {
    uuid: '105',
    message_parent_uuid: null,
    message: 'Here is another top-level comment demonstrating independent discussion threads.',
    created_at: '2025-02-14T10:00:00.000Z',
    author_id: 'usr-2',
    author_name: 'Priya Patel',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    author_role: 'Author',
    reactions: [{ emoji: '👍', count: 5, hasReacted: false }],
  },
];

// 2. Custom Enterprise DB Schema
const customEnterpriseData = [
  {
    commentId: 'ent-1',
    replyToId: null,
    body: 'Enterprise Schema Demo: using commentId, replyToId, body, and userProfile mapping.',
    postedAt: '2025-02-14T05:00:00.000Z',
    userProfile: {
      id: 'usr-1',
      name: 'Aarav Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Admin',
    },
    reactions: [{ emoji: '🚀', count: 8, hasReacted: true }],
  },
  {
    commentId: 'ent-2',
    replyToId: 'ent-1',
    body: 'Any custom object structure can be mapped seamlessly in just 4 lines of code!',
    postedAt: '2025-02-14T06:00:00.000Z',
    userProfile: {
      id: 'usr-3',
      name: 'Rohan Mehta',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      role: 'Member',
    },
  },
];

const customEnterpriseSchema: CommentFieldMapping<any> = {
  idKey: 'commentId',
  parentIdKey: 'replyToId',
  contentKey: 'body',
  createdAtKey: 'postedAt',
  authorKey: (item) => item.userProfile,
  reactionsKey: 'reactions',
};

// Styling Preset Themes
const stylePresets: Record<string, { label: string; styles: CommentCustomStyles }> = {
  default: {
    label: 'Clean Minimalist (Default)',
    styles: {},
  },
  glassmorphism: {
    label: 'Modern Card / Glassmorphism',
    styles: {
      root: {
        p: 2,
        borderRadius: 4,
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      },
      composerInput: {
        borderRadius: 4,
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
      },
      commentItem: {
        p: 1.5,
        borderRadius: 3,
        bgcolor: 'background.paper',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.06)',
      },
      reactionChip: {
        borderRadius: '8px',
      },
    },
  },
  discord: {
    label: 'Compact Forum / Discord Style',
    styles: {
      root: {
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 2,
      },
      commentItem: {
        py: 0.5,
        my: 0.5,
        '&:hover': {
          bgcolor: 'action.hover',
          borderRadius: 1.5,
        },
      },
      composerInput: {
        borderRadius: 2,
        bgcolor: 'action.hover',
      },
      authorName: {
        color: '#6366f1',
        fontWeight: 700,
      },
    },
  },
  bordered: {
    label: 'Bold Bordered / High Contrast',
    styles: {
      composerInput: {
        border: '2px solid #000000',
        borderRadius: 2,
      },
      commentItem: {
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 1.5,
      },
      reactionChip: {
        border: '1.5px solid #000000',
        borderRadius: '6px',
      },
    },
  },
};

export default function LibraryDemoPage() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  // Styling Preset state
  const [selectedStylePreset, setSelectedStylePreset] = useState<string>('default');

  // Schema state
  const [selectedSchema, setSelectedSchema] = useState<'room-chat' | 'custom'>('room-chat');
  const [commentsState, setCommentsState] = useState<any[]>(initialRoomChatData);

  // Business Rules & Customization State
  const [showAvatars, setShowAvatars] = useState(true);
  const [avatarShape, setAvatarShape] = useState<'circle' | 'rounded' | 'square'>('circle');
  const [enableNesting, setEnableNesting] = useState(true);
  const [maxDepth, setMaxDepth] = useState<number>(5);
  const [showThreadLines, setShowThreadLines] = useState(true);
  const [collapsible, setCollapsible] = useState(true);
  const [enableReactions, setEnableReactions] = useState(true);
  const [enableEmojiPicker, setEnableEmojiPicker] = useState(true);
  const [composerPosition, setComposerPosition] = useState<'top' | 'bottom' | 'both'>('top');
  const [softDeleteHandling, setSoftDeleteHandling] = useState<'placeholder' | 'hide'>('placeholder');
  const [selectedUserKey, setSelectedUserKey] = useState<string>('admin');
  const [sortBy, setSortBy] = useState<CommentSortOption>('newest');

  // Permission settings
  const [allowGuestReplies, setAllowGuestReplies] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentUser = sampleUsers[selectedUserKey];

  // MUI Theme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#2563eb',
          },
          secondary: {
            main: '#7c3aed',
          },
          background: {
            default: darkMode ? '#090d16' : '#f8fafc',
            paper: darkMode ? '#111827' : '#ffffff',
          },
        },
        typography: {
          fontFamily: 'inherit',
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [darkMode]
  );

  const activeCustomStyles = stylePresets[selectedStylePreset]?.styles || {};

  const handleSchemaChange = (schema: 'room-chat' | 'custom') => {
    setSelectedSchema(schema);
    if (schema === 'room-chat') {
      setCommentsState(initialRoomChatData);
    } else {
      setCommentsState(customEnterpriseData);
    }
  };

  const handleResetData = () => {
    if (selectedSchema === 'room-chat') {
      setCommentsState(initialRoomChatData);
    } else {
      setCommentsState(customEnterpriseData);
    }
  };

  // Handlers for comment actions
  const handleSubmitComment = async ({ content, parentId }: { content: string; parentId: string | null }) => {
    const newId = `new-${Date.now()}`;
    if (selectedSchema === 'room-chat') {
      const newRow = {
        uuid: newId,
        message_parent_uuid: parentId,
        message: content,
        created_at: new Date().toISOString(),
        author_id: currentUser.id,
        author_name: currentUser.name,
        author_avatar: currentUser.avatarUrl,
        author_role: currentUser.role,
        reactions: [],
      };
      setCommentsState((prev) => [newRow, ...prev]);
    } else {
      const newRow = {
        commentId: newId,
        replyToId: parentId,
        body: content,
        postedAt: new Date().toISOString(),
        userProfile: currentUser,
        reactions: [],
      };
      setCommentsState((prev) => [newRow, ...prev]);
    }
  };

  const handleEditComment = async ({ id, content }: { id: string; content: string }) => {
    setCommentsState((prev) =>
      prev.map((c) => {
        const cId = selectedSchema === 'room-chat' ? c.uuid : c.commentId;
        if (cId === id) {
          return selectedSchema === 'room-chat'
            ? { ...c, message: content, updated_at: new Date().toISOString() }
            : { ...c, body: content, updatedAt: new Date().toISOString() };
        }
        return c;
      })
    );
  };

  const handleDeleteComment = async ({ id }: { id: string }) => {
    if (softDeleteHandling === 'placeholder') {
      setCommentsState((prev) =>
        prev.map((c) => {
          const cId = selectedSchema === 'room-chat' ? c.uuid : c.commentId;
          if (cId === id) {
            return selectedSchema === 'room-chat'
              ? { ...c, deleted_at: new Date().toISOString(), message: '' }
              : { ...c, deletedAt: new Date().toISOString(), body: '' };
          }
          return c;
        })
      );
    } else {
      setCommentsState((prev) =>
        prev.filter((c) => (selectedSchema === 'room-chat' ? c.uuid !== id : c.commentId !== id))
      );
    }
  };

  const handleReactComment = async ({ id, emoji, action }: { id: string; emoji: string; action: 'add' | 'remove' }) => {
    setCommentsState((prev) =>
      prev.map((c) => {
        const cId = selectedSchema === 'room-chat' ? c.uuid : c.commentId;
        if (cId === id) {
          const reactions = [...(c.reactions || [])];
          const idx = reactions.findIndex((r) => r.emoji === emoji);
          if (action === 'add') {
            if (idx >= 0) {
              reactions[idx] = {
                ...reactions[idx],
                count: reactions[idx].count + 1,
                hasReacted: true,
                users: [...(reactions[idx].users || []), currentUser.name],
              };
            } else {
              reactions.push({
                emoji,
                count: 1,
                hasReacted: true,
                users: [currentUser.name],
              });
            }
          } else {
            if (idx >= 0) {
              const newCount = reactions[idx].count - 1;
              if (newCount <= 0) {
                reactions.splice(idx, 1);
              } else {
                reactions[idx] = {
                  ...reactions[idx],
                  count: newCount,
                  hasReacted: false,
                  users: (reactions[idx].users || []).filter((u: any) => u !== currentUser.name),
                };
              }
            }
          }
          return { ...c, reactions };
        }
        return c;
      })
    );
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate dynamic sample code
  const generatedCode = `import { NestedComments } from 'birwal-react-comment-lib';

export default function DiscussionPage() {
  const comments = ${JSON.stringify(commentsState.slice(0, 2), null, 2)};

  return (
    <NestedComments
      comments={comments}
      schema="${selectedSchema === 'room-chat' ? 'room-chat' : 'custom'}"
      currentUser={{
        id: '${currentUser.id}',
        name: '${currentUser.name}',
        role: '${currentUser.role || ''}',
        avatarUrl: ${currentUser.avatarUrl ? `'${currentUser.avatarUrl}'` : 'undefined'},
      }}
      config={{
        enableNesting: ${enableNesting},
        maxDepth: ${maxDepth},
        showAvatars: ${showAvatars},
        avatarShape: '${avatarShape}',
        showThreadLines: ${showThreadLines},
        collapsible: ${collapsible},
        enableReactions: ${enableReactions},
        enableEmojiPicker: ${enableEmojiPicker},
        composerPosition: '${composerPosition}',
        softDeleteHandling: '${softDeleteHandling}',
      }}
      styles={${JSON.stringify(activeCustomStyles, null, 2)}}
      permissions={{
        canReply: (comment, user) => ${selectedUserKey === 'guest' && !allowGuestReplies ? 'false' : 'true'},
        canEdit: (comment, user) => user?.role === 'Admin' || comment.author.id === user?.id,
        canDelete: (comment, user) => user?.role === 'Admin' || comment.author.id === user?.id,
      }}
      onSubmitComment={async ({ content, parentId }) => {
        // Save to DB via Server Action / API
        console.log('Submitting:', content, 'Parent:', parentId);
      }}
      onEditComment={async ({ id, content }) => {
        // Update in DB
      }}
      onDeleteComment={async ({ id }) => {
        // Soft delete / Delete from DB
      }}
      onReactComment={async ({ id, emoji, action }) => {
        // Toggle reaction in DB
      }}
    />
  );
}`;

  if (!mounted) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#090d16', color: '#ffffff' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>Loading birwal-react-comment-lib...</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
        {/* Navigation & Header */}
        <Paper
          elevation={0}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backdropFilter: 'blur(12px)',
            bgcolor: darkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <Container maxWidth="xl" sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                  p: 1,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                <ForumRoundedIcon />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                    birwal-react-comment-lib
                  </Typography>
                  <Chip label="v1.0.0" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                  <Chip label="npm package" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Universal Nested & Threaded Comments Component for React & Next.js
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Tooltip title={darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}>
                <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                  {darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                </IconButton>
              </Tooltip>
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshRoundedIcon />}
                onClick={handleResetData}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Reset Demo Data
              </Button>
            </Box>
          </Container>
        </Paper>

        {/* Hero Banner */}
        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3.5 },
              mb: 4,
              borderRadius: 4,
              background: darkMode
                ? 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(124,58,237,0.15) 100%)'
                : 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(124,58,237,0.06) 100%)',
              border: '1px solid',
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(37,99,235,0.15)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.01em' }}>
                Universal Threaded Comments Component
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                Works with <strong>TypeORM RoomChatEntity</strong>, Prisma, Supabase, or any custom database schema.
                Customizable business rules: show/hide avatars, switch between nested vs flat linear comments, control max nesting depth, custom CSS styling for every UI element, and granular role permissions.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="MUI Components" size="small" variant="filled" />
              <Chip label="emoji-picker-react" size="small" variant="filled" />
              <Chip label="React Hook Form + Zod" size="small" variant="filled" />
              <Chip label="Custom CSS / Styles" size="small" color="secondary" />
              <Chip label="TypeScript" size="small" color="primary" />
            </Box>
          </Box>

          {/* Main 2-Column Split Layout */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' }, gap: 4 }}>
            {/* Left Column: Live Comment Component */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                {/* Active user status banner */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    mb: 2.5,
                    borderRadius: 2.5,
                    bgcolor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Logged in as:
                    </Typography>
                    <Chip
                      size="small"
                      label={`${currentUser.name} (${currentUser.role})`}
                      color={currentUser.role === 'Admin' ? 'primary' : currentUser.role === 'Author' ? 'secondary' : 'default'}
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Schema: <strong>{selectedSchema === 'room-chat' ? 'RoomChatEntity (uuid)' : 'Custom Enterprise'}</strong>
                  </Typography>
                </Box>

                {/* THE CORE COMPONENT */}
                <NestedComments
                  comments={commentsState}
                  schema={selectedSchema === 'room-chat' ? 'room-chat' : customEnterpriseSchema}
                  currentUser={currentUser}
                  config={{
                    enableNesting,
                    maxDepth,
                    showAvatars,
                    avatarShape,
                    showThreadLines,
                    collapsible,
                    enableReactions,
                    enableEmojiPicker,
                    composerPosition,
                    softDeleteHandling,
                    sortBy,
                  }}
                  styles={activeCustomStyles}
                  permissions={{
                    canReply: (comment, user) => {
                      if (user?.role === 'Guest' && !allowGuestReplies) return false;
                      return true;
                    },
                    canEdit: (comment, user) => user?.role === 'Admin' || comment.author.id === user?.id,
                    canDelete: (comment, user) => user?.role === 'Admin' || comment.author.id === user?.id,
                    canPin: (comment, user) => user?.role === 'Admin' || user?.role === 'Author',
                  }}
                  onSortChange={(newSort) => setSortBy(newSort)}
                  onSubmitComment={handleSubmitComment}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  onReactComment={handleReactComment}
                />
              </Paper>
            </Box>

            {/* Right Column: Configuration Controls, Schema Guide, Code Generator */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  overflow: 'hidden',
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={(_, val) => setActiveTab(val)}
                  variant="fullWidth"
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                  }}
                >
                  <Tab icon={<TuneRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Customization" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab icon={<PaletteRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Custom CSS" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab icon={<StorageRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="DB Schema" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab icon={<CodeRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Code & Props" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab icon={<MenuBookRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="NPM Docs" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>

                {/* TAB 0: Interactive Customization Controls */}
                {activeTab === 0 && (
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* User Persona Switcher */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        1. Current User Persona (Role & Permissions)
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={selectedUserKey}
                          onChange={(e) => setSelectedUserKey(e.target.value)}
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="admin">Aarav Sharma (Admin - Full permissions)</MenuItem>
                          <MenuItem value="author">Priya Patel (Author - Can pin and edit own)</MenuItem>
                          <MenuItem value="member">Rohan Mehta (Member - Regular user)</MenuItem>
                          <MenuItem value="guest">Guest Viewer (Read only / Restricted)</MenuItem>
                        </Select>
                      </FormControl>
                      {selectedUserKey === 'guest' && (
                        <FormControlLabel
                          control={<Switch size="small" checked={allowGuestReplies} onChange={(e) => setAllowGuestReplies(e.target.checked)} />}
                          label={<Typography variant="caption">Allow guest replies</Typography>}
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>

                    <Divider />

                    {/* Business Rule: Show / Hide Avatars */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        2. User Image & Avatar Business Rules
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        Custom rule for companies whose business rules require hiding user images or displaying specific shapes.
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControlLabel
                          control={<Switch checked={showAvatars} onChange={(e) => setShowAvatars(e.target.checked)} color="primary" />}
                          label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{showAvatars ? 'Show User Images & Avatars' : 'Hide User Images completely'}</Typography>}
                        />
                        {showAvatars && (
                          <Box sx={{ mt: 1 }}>
                            <FormLabel sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Avatar Shape</FormLabel>
                            <RadioGroup
                              row
                              value={avatarShape}
                              onChange={(e) => setAvatarShape(e.target.value as any)}
                            >
                              <FormControlLabel value="circle" control={<Radio size="small" />} label="Circle" />
                              <FormControlLabel value="rounded" control={<Radio size="small" />} label="Rounded" />
                              <FormControlLabel value="square" control={<Radio size="small" />} label="Square" />
                            </RadioGroup>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Divider />

                    {/* Business Rule: Nested vs Flat Sequential */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        3. Threading Mode: Nested vs Flat Linear
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                        Switch between full nested threaded conversations or simple one-by-one sequential linear comments.
                      </Typography>
                      <FormControlLabel
                        control={<Switch checked={enableNesting} onChange={(e) => setEnableNesting(e.target.checked)} color="primary" />}
                        label={<Typography variant="body2" sx={{ fontWeight: 500 }}>{enableNesting ? 'Nested Threaded Comments (Active)' : 'Simple One-by-One Linear Comments'}</Typography>}
                      />

                      {enableNesting && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                            <span>Max Nesting Depth Limit:</span>
                            <span>{maxDepth >= 10 ? 'Unlimited (Infinity)' : `${maxDepth} level${maxDepth === 1 ? '' : 's'}`}</span>
                          </Typography>
                          <Slider
                            value={maxDepth}
                            min={1}
                            max={10}
                            step={1}
                            onChange={(_, val) => setMaxDepth(val as number)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(x) => (x >= 10 ? '∞' : x)}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      )}
                    </Box>

                    <Divider />

                    {/* UI & Interaction Options */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        4. UI & Interaction Features
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        <FormControlLabel
                          control={<Switch size="small" checked={showThreadLines} onChange={(e) => setShowThreadLines(e.target.checked)} />}
                          label={<Typography variant="body2" sx={{ fontSize: '0.825rem' }}>Thread Lines</Typography>}
                        />
                        <FormControlLabel
                          control={<Switch size="small" checked={collapsible} onChange={(e) => setCollapsible(e.target.checked)} />}
                          label={<Typography variant="body2" sx={{ fontSize: '0.825rem' }}>Collapsible Branches</Typography>}
                        />
                        <FormControlLabel
                          control={<Switch size="small" checked={enableReactions} onChange={(e) => setEnableReactions(e.target.checked)} />}
                          label={<Typography variant="body2" sx={{ fontSize: '0.825rem' }}>Emoji Reactions</Typography>}
                        />
                        <FormControlLabel
                          control={<Switch size="small" checked={enableEmojiPicker} onChange={(e) => setEnableEmojiPicker(e.target.checked)} />}
                          label={<Typography variant="body2" sx={{ fontSize: '0.825rem' }}>Emoji Picker Popup</Typography>}
                        />
                      </Box>

                      <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Composer Position</InputLabel>
                          <Select
                            value={composerPosition}
                            label="Composer Position"
                            onChange={(e) => setComposerPosition(e.target.value as any)}
                          >
                            <MenuItem value="top">Top only</MenuItem>
                            <MenuItem value="bottom">Bottom only</MenuItem>
                            <MenuItem value="both">Both Top & Bottom</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                          <InputLabel>Soft Delete Mode</InputLabel>
                          <Select
                            value={softDeleteHandling}
                            label="Soft Delete Mode"
                            onChange={(e) => setSoftDeleteHandling(e.target.value as any)}
                          >
                            <MenuItem value="placeholder">Show Placeholder</MenuItem>
                            <MenuItem value="hide">Hide completely</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* TAB 1: Custom CSS & Styling Engine */}
                {activeTab === 1 && (
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Custom CSS & Styling Customizer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You can customize the CSS, SX props, and class names of <strong>ANY</strong> element in the component (root, composer, cards, avatar, buttons, reaction chips, thread lines).
                    </Typography>

                    <Box>
                      <FormLabel sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, display: 'block' }}>
                        Choose Styling Preset:
                      </FormLabel>
                      <FormControl fullWidth size="small">
                        <Select
                          value={selectedStylePreset}
                          onChange={(e) => setSelectedStylePreset(e.target.value)}
                          sx={{ borderRadius: 2 }}
                        >
                          {Object.entries(stylePresets).map(([key, item]) => (
                            <MenuItem key={key} value={key}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 1 }}>
                        Active <code>styles</code> Object:
                      </Typography>
                      <pre style={{ margin: 0, fontSize: '0.75rem', overflowX: 'auto', fontFamily: 'monospace' }}>
{JSON.stringify(activeCustomStyles, null, 2)}
                      </pre>
                    </Paper>

                    <Alert severity="info" sx={{ py: 0.5 }}>
                      Pass <code>styles=&#123;&#123; root: &#123;...&#125;, composer: &#123;...&#125;, commentItem: &#123;...&#125; &#125;&#125;</code> or <code>classes=&#123;&#123; ... &#125;&#125;</code> to override any CSS rule.
                    </Alert>
                  </Box>
                )}

                {/* TAB 2: Database Schema Mapping Guide */}
                {activeTab === 2 && (
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Universal Database Schema Adapter
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This component works with <strong>ANY</strong> database entity. Choose a preset or map your own fields:
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant={selectedSchema === 'room-chat' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleSchemaChange('room-chat')}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        RoomChatEntity Schema
                      </Button>
                      <Button
                        variant={selectedSchema === 'custom' ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleSchemaChange('custom')}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        Custom Enterprise Schema
                      </Button>
                    </Box>

                    {selectedSchema === 'room-chat' ? (
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 1 }}>
                          TypeORM Entity Definition (chat-db.entity.ts):
                        </Typography>
                        <pre style={{ margin: 0, fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace' }}>
{`@Entity("chat")
export class RoomChatEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: "uuid", nullable: true })
    message_parent_uuid: string;

    @Column({ type: "text" })
    message: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}`}
                        </pre>
                        <Alert severity="success" sx={{ mt: 2, py: 0.5 }}>
                          Just pass <code>schema="room-chat"</code> to automatically map <code>uuid</code>, <code>message_parent_uuid</code>, and <code>message</code>!
                        </Alert>
                      </Paper>
                    ) : (
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)', borderRadius: 2 }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 1 }}>
                          Custom Field Mapping Configuration:
                        </Typography>
                        <pre style={{ margin: 0, fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace' }}>
{`const customSchema = {
  idKey: 'commentId',
  parentIdKey: 'replyToId',
  contentKey: 'body',
  createdAtKey: 'postedAt',
  authorKey: (item) => ({
    id: item.userProfile.id,
    name: item.userProfile.name,
    avatarUrl: item.userProfile.avatarUrl,
  }),
  reactionsKey: 'reactions',
};`}
                        </pre>
                      </Paper>
                    )}
                  </Box>
                )}

                {/* TAB 3: Dynamic Live Code Generator */}
                {activeTab === 3 && (
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Live Generated Code
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                        onClick={() => handleCopyCode(generatedCode)}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                      >
                        {copied ? 'Copied!' : 'Copy Code'}
                      </Button>
                    </Box>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        maxHeight: 480,
                        overflowY: 'auto',
                        bgcolor: darkMode ? '#05070d' : '#f1f5f9',
                        borderRadius: 2.5,
                      }}
                    >
                      <pre style={{ margin: 0, fontSize: '0.775rem', fontFamily: 'monospace', lineHeight: 1.5 }}>
                        {generatedCode}
                      </pre>
                    </Paper>
                  </Box>
                )}

                {/* TAB 4: NPM Documentation & Installation */}
                {activeTab === 4 && (
                  <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Publishing & Installing on NPM
                    </Typography>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                        Step 1: Install Package
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <code style={{ fontSize: '0.85rem' }}>npm install birwal-react-comment-lib</code>
                        <IconButton size="small" onClick={() => handleCopyCode('npm install birwal-react-comment-lib')}>
                          <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                        Step 2: Build Library for NPM Release
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper', p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <code style={{ fontSize: '0.85rem' }}>npm run build:lib && npm publish</code>
                        <IconButton size="small" onClick={() => handleCopyCode('npm run build:lib && npm publish')}>
                          <ContentCopyRoundedIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Paper>

                    <Typography variant="body2" color="text.secondary">
                      Includes full TypeScript declaration files (<code>.d.ts</code>), CJS & ESM bundles, and works out-of-the-box with Next.js 14/15/16 App Router (<code>&quot;use client&quot;</code> compatible).
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
