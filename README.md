# opencode-terminal-notify

An [OpenCode](https://opencode.ai) plugin that sends **OSC 9 terminal escape sequence notifications** — designed for SSH/remote workflows where native desktop notifications don't reach your local machine.

## Why This Exists

OpenCode's built-in desktop notifications use native OS APIs (e.g. Electron `Notification`), which don't work when OpenCode is running on a remote server over SSH. This plugin solves that by emitting OSC 9 escape sequences instead — these travel through the SSH pipe and are interpreted by your **local terminal** (Ghostty, iTerm2, Windows Terminal, etc.) as native macOS/OS notifications.

## Events

| Event | Notification |
|-------|-------------|
| Agent finishes its turn | `OpenCode: Agent finished` |
| Agent needs permission | `OpenCode: Permission needed — <type>` |

Sub-agent completions (e.g. `@general`, `@explore`) are intentionally **suppressed** to avoid notification spam ([GitHub #13334](https://github.com/anomalyco/opencode/issues/13334)). Only the primary (root) session triggers a notification.

## Requirements

- [OpenCode](https://opencode.ai) CLI
- A terminal that supports **OSC 9** notifications:
  - [Ghostty](https://ghostty.org) ✓
  - iTerm2 ✓
  - Windows Terminal ✓
- macOS notifications enabled for your terminal app in **System Settings → Notifications**

## Installation

### Option A: From npm (once published)

Add to your `opencode.json`:

```json
{
  "plugins": ["opencode-terminal-notify"]
}
```

### Option B: Local file (development / before publishing)

1. Clone this repo and build it:

```bash
git clone https://github.com/your-username/opencode-terminal-notify
cd opencode-terminal-notify
npm install
npm run build
```

2. Add the absolute path to your `opencode.json`:

```json
{
  "plugins": ["file:///absolute/path/to/opencode-terminal-notify/dist/index.js"]
}
```

### Option C: Global plugin (applies to all projects)

Place the built file at:

```
~/.config/opencode/plugins/terminal-notify.js
```

OpenCode auto-loads all `.js` and `.ts` files in that directory.

## Ghostty Setup

Ghostty supports OSC 9 out of the box. Just make sure macOS notifications are allowed:

1. Open **System Settings → Notifications**
2. Find **Ghostty** in the list
3. Enable notifications (Banners or Alerts)

No Ghostty config changes needed.

## Building

```bash
npm install
npm run build   # outputs to dist/index.js
npm run dev     # watch mode
```

## How It Works

OpenCode's plugin system subscribes to all internal bus events. This plugin:

1. Watches `session.created` events to identify sub-agent sessions (those with a `parentID`)
2. On `session.idle` — if the session is **not** a sub-agent — writes an OSC 9 escape sequence to stdout
3. On `permission.asked` — writes an OSC 9 escape sequence with the permission type

The OSC 9 format is:
```
ESC ] 9 ; <message> BEL
```
(`\x1b]9;message\x07` in escape notation)

## License

MIT
