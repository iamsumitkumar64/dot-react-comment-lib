# dot-react-comment-lib

> **High-performance, ultra-customizable nested threaded comments library for React and Next.js**, built with Material UI (MUI), `emoji-picker-react`, `react-hook-form`, `@hookform/resolvers`, and `@emotion/styled`.

[![npm version](https://img.shields.io/npm/v/dot-react-comment-lib.svg?style=flat-square)](https://www.npmjs.com/package/dot-react-comment-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![React](<https://img.shields.io/badge/React-18%20%2F%2019-61dafb.svg?style=flat-square>)](https://react.dev)
[![Next.js](<https://img.shields.io/badge/Next.js-App%20Router%20%2F%20Pages-black.svg?style=flat-square>)](https://nextjs.org/)
[![Bundle Size](<https://img.shields.io/badge/Bundle-~31KB%20Minified-success.svg?style=flat-square>)](https://bundlephobia.com)

---

## ⚡ Key Optimizations

- 🚀 **Blazing Fast & Ultra Lightweight**: Only **~31 KB** minified bundle size.
- 💤 **Lazy-Loaded Emoji Picker**: `emoji-picker-react` (~300 KB) is loaded dynamically **only** when the user opens the emoji popover, ensuring instant initial page loads.
- 🛡️ **Zero Unnecessary Re-Renders**: Every subcomponent is optimized with `React.memo` and stable callback selectors. Reacting or editing one comment will never re-render the whole thread tree.
- 🔄 **Universal Database Schema Adapter**: Works directly with **ANY** database entity (`RoomChatEntity`, Prisma, Supabase, MongoDB, REST APIs) — automatically converts flat database rows into nested threads on the fly.
- 🎭 **Complete Business Rules Freedom**: Easily toggle user avatars on/off, switch between nested vs flat linear comments, limit nesting depth, and customize CSS on every element.

---

## 📊 With vs. Without Customization Overview

| Feature                         | WITHOUT Customization (Default)                          | WITH Customization                                                   |
| :------------------------------ | :------------------------------------------------------- | :------------------------------------------------------------------- |
| **Data Schema**           | Standard`{ id, parentId, content, createdAt, author }` | Any DB Schema (`uuid`, `message_parent_uuid`, `message`, etc.) |
| **Comment Threading**     | Multi-level nested tree (`enableNesting: true`)        | Simple flat linear comments (`enableNesting: false`)               |
| **Nesting Depth**         | Unlimited (`maxDepth: Infinity`)                       | Limited to 1, 2, 3, or N levels                                      |
| **User Images / Avatars** | Displayed with circle shape & initials fallback          | Hidden completely (`showAvatars: false`) or custom shapes          |
| **CSS & Styles**          | Modern clean MUI theme                                   | Custom CSS /`styles` / `classes` for every component             |
| **Permissions**           | Authors can edit/delete own comments                     | Custom role functions (Admin, Moderator, Guest read-only)            |
| **Reactions & Emojis**    | Quick reactions + full lazy-loaded emoji picker          | Toggleable on/off, custom quick emoji list                           |
| **Soft Deletions**        | `"[This comment has been deleted]"` placeholder        | Hard remove (`softDeleteHandling: 'hide'`)                         |

---

## 📦 Installation

```bash
npm install dot-react-comment-lib
```

### Peer Dependencies

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-hook-form @hookform/resolvers zod emoji-picker-react
```

---

## 🚀 Usage Guide

### 1. Usage WITHOUT Customization (Zero Configuration)

If you have standard comment objects, just pass `comments` and `currentUser`. It works instantly out-of-the-box:

```tsx
'use client';

import { NestedComments } from 'dot-react-comment-lib';

const simpleComments = [
  {
    id: '1',
    parentId: null,
    content: 'This is a top-level comment!',
    createdAt: '2025-02-14T08:00:00.000Z',
    author: { id: 'u1', name: 'Aarav Sharma' },
  },
  {
    id: '2',
    parentId: '1',
    content: 'This is an automatic reply to comment #1.',
    createdAt: '2025-02-14T08:30:00.000Z',
    author: { id: 'u2', name: 'Priya Patel' },
  },
];

export default function BasicComments() {
  return (
    <NestedComments
      comments={simpleComments}
      currentUser={{ id: 'u1', name: 'Aarav Sharma' }}
      onSubmitComment={({ content, parentId }) => {
        console.log('Submitting:', content, 'Reply to:', parentId);
      }}
    />
  );
}
```

---

### 2. Usage WITH Database Schema Mapping

#### A. TypeORM `RoomChatEntity` Schema (`schema="room-chat"`)

If your backend database matches the `RoomChatEntity` structure (`uuid`, `message_parent_uuid`, `message`, `created_at`, `deleted_at`), pass `schema="room-chat"`:

```tsx
import { NestedComments } from 'dot-react-comment-lib';

export function RoomChatComponent({ dbRows }) {
  return (
    <NestedComments
      comments={dbRows} // Flat rows from RoomChatEntity
      schema="room-chat"
      currentUser={{ id: 'usr-1', name: 'Aarav Sharma', role: 'Admin' }}
      onSubmitComment={async ({ content, parentId }) => {
        // Save to TypeORM / database endpoint
      }}
    />
  );
}
```

#### B. Custom Database Schema Adapter (Prisma, MongoDB, REST)

Map any database structure in just a few lines:

```tsx
import { NestedComments, CommentFieldMapping } from 'dot-react-comment-lib';

interface PostCommentEntity {
  comment_id: string;
  reply_to_id?: string | null;
  body_text: string;
  timestamp: string;
  user_info: {
    user_id: string;
    display_name: string;
    avatar_link?: string;
  };
}

const customAdapter: CommentFieldMapping<PostCommentEntity> = {
  idKey: 'comment_id',
  parentIdKey: 'reply_to_id',
  contentKey: 'body_text',
  createdAtKey: 'timestamp',
  authorKey: (item) => ({
    id: item.user_info.user_id,
    name: item.user_info.display_name,
    avatarUrl: item.user_info.avatar_link,
  }),
};

export function CustomDatabaseComments({ data }) {
  return (
    <NestedComments
      comments={data}
      schema={customAdapter}
      currentUser={{ id: 'u1', name: 'Alex' }}
    />
  );
}
```

---

### 3. Usage WITH Business Rules

#### A. Hide User Images Completely (`showAvatars: false`)

When corporate privacy rules dictate that no user photos should be shown:

```tsx
<NestedComments
  comments={comments}
  config={{
    showAvatars: false, // User photos and avatars are completely hidden
  }}
/>
```

#### B. Simple One-by-One Linear Comments (`enableNesting: false`)

When you want a sequential flat timeline without replies or indentation:

```tsx
<NestedComments
  comments={comments}
  config={{
    enableNesting: false, // Renders flat sequential comments without nesting
  }}
/>
```

#### C. Limit Nesting Depth (`maxDepth`)

Restrict replies to a specific indentation level (e.g. max 2 levels):

```tsx
<NestedComments
  comments={comments}
  config={{
    maxDepth: 2, // Only allows 2 levels of reply depth
  }}
/>
```

#### D. Avatar Shapes & Custom Styling

```tsx
<NestedComments
  comments={comments}
  config={{
    avatarShape: 'rounded', // 'circle' | 'rounded' | 'square'
    showThreadLines: true,  // Draw vertical connector lines
    collapsible: true,      // Allow collapsing branches
    enableEmojiPicker: true,// Lazy-loaded emoji picker popover
  }}
/>
```

---

### 4. Usage WITH Custom CSS & Granular Styling (`styles` & `classes`)

You can customize the styling, colors, borders, and shadows of **every single element** in the UI:

```tsx
<NestedComments
  comments={comments}
  styles={{
    // Root container
    root: {
      p: 2,
      borderRadius: 4,
      background: 'rgba(255, 255, 255, 0.8)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
    },
    // Header & counters
    header: { pb: 2, borderBottom: '2px solid #e2e8f0' },
    title: { color: '#1e293b', fontWeight: 800 },
    countBadge: { bgcolor: '#6366f1', color: '#ffffff' },
  
    // Main composer & reply box
    composer: { my: 2 },
    composerInput: {
      borderRadius: 3,
      border: '2px solid #6366f1',
    },
    composerSubmitButton: {
      bgcolor: '#6366f1',
      '&:hover': { bgcolor: '#4f46e5' },
    },
  
    // Comment row cards
    commentItem: {
      p: 1.5,
      borderRadius: 2.5,
      '&:hover': { bgcolor: 'action.hover' },
    },
    authorName: { color: '#4f46e5', fontWeight: 700 },
    commentBody: { fontSize: '0.95rem', lineHeight: 1.6 },
  
    // Emoji reaction chips
    reactionChip: {
      borderRadius: '8px',
      border: '1.5px solid #e2e8f0',
    },
    activeReactionChip: {
      bgcolor: 'rgba(99, 102, 241, 0.15)',
      borderColor: '#6366f1',
    },
  
    // Thread lines
    threadLine: { bgcolor: '#6366f1', width: '2px' },
  }}
  classes={{
    root: 'my-custom-wrapper',
    composer: 'my-custom-composer',
    commentItem: 'my-custom-card',
  }}
/>
```

---

### 5. Usage WITH Granular Role Permissions

```tsx
<NestedComments
  comments={comments}
  currentUser={currentUser}
  permissions={{
    // Disable replies for guests
    canReply: (comment, user) => user?.role !== 'Guest',
    // Only Admins or comment authors can edit
    canEdit: (comment, user) => user?.role === 'Admin' || comment.author.id === user?.id,
    // Only Admins or comment authors can delete
    canDelete: (comment, user) => user?.role === 'Admin' || comment.author.id === user?.id,
    // Only Admins and Authors can pin comments
    canPin: (comment, user) => user?.role === 'Admin' || user?.role === 'Author',
  }}
/>
```

---

### 6. Headless State Management: `useCommentTree` Hook

For optimistic UI updates with custom API calls:

```tsx
import { useCommentTree, NestedComments } from 'dot-react-comment-lib';

export function OptimisticComments({ initialData }) {
  const {
    comments,
    addComment,
    editComment,
    deleteComment,
    reactToComment,
    totalComments,
  } = useCommentTree({
    initialData,
    schema: 'room-chat',
  });

  return (
    <NestedComments
      comments={comments}
      onSubmitComment={async ({ content, parentId }) => {
        addComment(content, parentId); // Optimistic UI update
        await api.saveComment({ content, parentId });
      }}
      onEditComment={async ({ id, content }) => {
        editComment(id, content);
        await api.updateComment(id, content);
      }}
      onDeleteComment={async ({ id }) => {
        deleteComment(id, true);
        await api.deleteComment(id);
      }}
      onReactComment={async ({ id, emoji }) => {
        reactToComment(id, emoji);
        await api.toggleReaction(id, emoji);
      }}
    />
  );
}
```

---

## 📖 Component Props Reference

### `<NestedComments />`

| Prop                | Type                                                 | Default                | Description                                                                     |
| :------------------ | :--------------------------------------------------- | :--------------------- | :------------------------------------------------------------------------------ |
| `comments`        | `T[]`                                              | `[]`                 | Array of raw comment data (flat list or nested tree).                           |
| `schema`          | `CommentFieldMapping<T> \| 'room-chat' \| 'default'` | `'default'`          | Database schema field adapter configuration.                                    |
| `currentUser`     | `CommentAuthor`                                    | `undefined`          | The currently logged-in user object.                                            |
| `config`          | `NestedCommentsConfig`                             | `{}`                 | Business rules and UI configurations (see table below).                         |
| `permissions`     | `CommentPermissions<T>`                            | `{}`                 | Permission predicates for reply, edit, delete, pin, react, report.              |
| `styles`          | `CommentCustomStyles`                              | `{}`                 | Granular custom styles/SX props for every UI element.                           |
| `classes`         | `CommentClassNames`                                | `{}`                 | Custom CSS classes for every UI element.                                        |
| `labels`          | `Partial<CommentLabels>`                           | `{}`                 | Internationalization & custom text labels.                                      |
| `renderers`       | `CommentCustomRenderers<T>`                        | `{}`                 | Custom slot overrides for avatar, header, body, actions, composer, empty state. |
| `onSubmitComment` | `(data) => Promise<void> \| void`                   | `undefined`          | Handler for submitting new comments / replies.                                  |
| `onEditComment`   | `(data) => Promise<void> \| void`                   | `undefined`          | Handler for editing a comment.                                                  |
| `onDeleteComment` | `(data) => Promise<void> \| void`                   | `undefined`          | Handler for deleting a comment.                                                 |
| `onReactComment`  | `(data) => Promise<void> \| void`                   | `undefined`          | Handler for adding/removing an emoji reaction.                                  |
| `onPinComment`    | `(data) => Promise<void> \| void`                   | `undefined`          | Handler for pinning/unpinning comments.                                         |
| `onReportComment` | `(data) => Promise<void> \| void`                   | `undefined`          | Handler for reporting a comment.                                                |
| `formatDate`      | `(date) => string`                                 | `formatRelativeTime` | Custom timestamp formatter function (e.g.,`"2h ago"`).                        |
| `sx`              | `SxProps<Theme>`                                   | `undefined`          | Root container MUI`sx` styling props.                                         |

---

### `config` Options (`NestedCommentsConfig`)

| Option                 | Type                                                    | Default                               | Description                                                          |
| :--------------------- | :------------------------------------------------------ | :------------------------------------ | :------------------------------------------------------------------- |
| `enableNesting`      | `boolean`                                             | `true`                              | When`false`, renders as simple one-by-one linear comments.         |
| `maxDepth`           | `number`                                              | `Infinity`                          | Maximum nesting depth level.                                         |
| `showAvatars`        | `boolean`                                             | `true`                              | Set to`false` to hide user images and photos.                      |
| `avatarShape`        | `'circle' \| 'rounded' \| 'square'`                     | `'circle'`                          | Shape of user avatars.                                               |
| `showThreadLines`    | `boolean`                                             | `true`                              | Whether to draw vertical connecting thread lines for nested replies. |
| `collapsible`        | `boolean`                                             | `true`                              | Allow collapsing/expanding nested reply branches.                    |
| `defaultExpanded`    | `boolean`                                             | `true`                              | Whether reply branches start expanded by default.                    |
| `enableReactions`    | `boolean`                                             | `true`                              | Enable reaction pills and counts.                                    |
| `quickReactions`     | `string[]`                                            | `['👍','❤️','🔥','🎉','🚀','👀']` | List of quick emoji buttons.                                         |
| `enableEmojiPicker`  | `boolean`                                             | `true`                              | Enable popup emoji picker from`emoji-picker-react`.                |
| `composerPosition`   | `'top' \| 'bottom' \| 'both' \| 'none'`                  | `'top'`                             | Placement of the main comment input box.                             |
| `softDeleteHandling` | `'placeholder' \| 'hide'`                              | `'placeholder'`                     | Keep deleted comments as placeholder or remove completely.           |
| `showSortControl`    | `boolean`                                             | `true`                              | Show sorting dropdown.                                               |
| `sortBy`             | `'newest' \| 'oldest' \| 'mostUpvoted' \| 'mostReplies'` | `'newest'`                          | Initial or controlled sort order.                                    |
| `minContentLength`   | `number`                                              | `1`                                 | Minimum characters for validation.                                   |
| `maxContentLength`   | `number`                                              | `5000`                              | Maximum characters for validation.                                   |

---

## 🏗️ Publishing to NPM

```bash
# 1. Build the lightweight minified bundle (creates ESM, CJS, and .d.ts in dist/)
npm run build:lib

# 2. Lotgin to npm
npm login

# 3. Publish to npm registry
npm publish
```

---

## 📄 License

MIT © dot
