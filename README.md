# opencode-terminal-notify

An [OpenCode](https://opencode.ai) plugin that sends **OSC 9 terminal escape sequence notifications** — designed for SSH/remote workflows where native desktop notifications don't reach your local machine.

## Installation

Copy the contents of `c9-notify.js` to `~/.config/opencode/plugins` (or somewhere else) and add the plugin to `~/.config/opencode/opencode.json` (create it if it doesn't exist):

```json
{
  "plugin": ["opencode-terminal-notify"]
}
```
