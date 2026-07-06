# Queue UX — Desktop & CLI

## Goals

- Ctrl+Enter queues a prompt instead of sending it directly
- Queued prompts are visible inline (not hidden behind a menu)
- User can reorder queued prompts (drag on desktop, alt+up/down on CLI)
- User can edit/remove queued prompts before they send
- Queue auto-drains: when the current turn completes, the next queued prompt sends automatically

## Architecture: Pure Additive Layer

**The existing prompt component (textarea + all buttons) is never modified.** The queue is a separate component that renders above the textarea — exactly like `PromptContextItems` already does. Nothing about the textarea or toolbar changes.

```
┌──────────────────────────────────────┐
│ [Fix login bug] [Update deps] [Add…] │  ← queue chips (additive layer)
├──────────────────────────────────────┤
│  PromptContextItems (context chips)   │  ← existing
│  PromptImageAttachments (images)      │  ← existing
│  textarea (contenteditable)           │  ← existing, unchanged
│                                       │
├──────────────────────────────────────┤
│  toolbar (attach, agent, model, send) │  ← existing, unchanged
└──────────────────────────────────────┘
```

**Feature invisibility** — Users who never press Ctrl+Enter see zero difference.

## Implementation Status

### Done

- **Reverted** queue toolbar toggle ("→ Steer" / "📥 Queue") and countdown timer
- **Ctrl+Enter** at form level queues current draft without clearing composer text
- `handleSubmit(event, queue?)` accepts optional queue flag
- Auto-drain sends immediately on idle (no 2s countdown)
- Editing, remove, toast with Undo, drain progress bar kept as useful

### To Build

- **Queue chips** — `PromptQueueItems` component renders as horizontal strip above textarea, shows truncated text, × remove, drag handle
- **Alt+Up/Down** — navigates focus between textarea and chip strip
- **Left/Right** — navigates between chips when focused
- **Drag to reorder** — HTML5 drag-and-drop on chips
- **Click/Enter on chip** — edits it (restores to composer)

## Desktop

| Action | Key | Notes |
|--------|-----|-------|
| Send prompt | `Enter` | Sends only current draft (clears composer) |
| Queue prompt | `Ctrl+Enter` | Queues draft without clearing composer |
| Navigate chips | `Alt+Up/Down` | Moves focus between textarea and chips |
| Navigate between chips | `Left/Right` | When chip strip is focused |
| Edit queued | Click chip or `Enter` | Restores prompt to composer |
| Remove from queue | `×` button or `Delete` | |
| Reorder | Drag or `Alt+Up/Down` in followup dock | |

## CLI (TUI)

| Current | Proposed |
|---------|----------|
| `input_newline`: `shift+return,ctrl+return,alt+return,ctrl+j` | `input_newline`: `shift+return,alt+return,ctrl+j` |
| — | New: `prompt_queue` keybind: `ctrl+return` |

CLI status bar already shows queue count. Alt+Up/Down in queued menu reorders items. Auto-drain exists.

## Shared Patterns

| Pattern | Desktop | CLI |
|---------|---------|-----|
| Trigger | `Ctrl+Enter` | `Ctrl+Enter` |
| Visual | Chips inline (to build) | Status bar count |
| Reorder | Drag or Alt+Up/Down | Alt+Up/Down in menu |
| Edit | Click chip or Enter | Ctrl+E in menu |
| Remove | × button or Delete | Ctrl+D in menu |
| Auto-drain | On turn idle | On turn idle |
| Persistence | Per-workspace | Session-only |
