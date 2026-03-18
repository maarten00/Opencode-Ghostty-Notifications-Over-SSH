# opencode-terminal-notify

An [OpenCode](https://opencode.ai) plugin that sends **OSC 9 terminal escape sequence notifications** — designed for SSH/remote workflows where native desktop notifications don't reach your local machine.

Built for Ghostty, but should work with any terminal emulator that supports OSC 9. Iterm2 should also work.

## Installation

Copy the contents of `oc9-notify.js` to `~/.config/opencode/plugins` (or somewhere else) and add the plugin to `~/.config/opencode/opencode.json` (create it if it doesn't exist):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["file:///path/to/your/oc9-notify.js"]
}
```

Make sure notifications are enabled for your Terminal emulator app in MacOS settings. Settings -> Notifications -> Ghostty. (Or whatever your terminal emulator is called)