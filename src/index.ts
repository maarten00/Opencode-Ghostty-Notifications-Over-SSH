import type { Plugin } from "@opencode-ai/plugin"

/**
 * Sends an OSC 9 terminal notification escape sequence.
 *
 * OSC 9 is supported by Ghostty, iTerm2, Windows Terminal, and other modern
 * terminals. Crucially, it works over SSH because it's just terminal output —
 * the escape sequence travels through the SSH pipe and is interpreted by the
 * local terminal on your Mac.
 *
 * Format: ESC ] 9 ; <message> BEL
 */
function sendTerminalNotification(message: string): void {
  process.stdout.write(`\x1b]9;${message}\x07`)
}

export const TerminalNotifyPlugin: Plugin = async () => {
  /**
   * Track child/sub-agent session IDs so we can suppress their idle events.
   *
   * OpenCode fires `session.idle` for every session — including sub-agents
   * (e.g. @general, @explore). We only want to notify when the primary (root)
   * session goes idle. Sub-agent sessions always have a `parentID` set on
   * their `session.created` event, which we use to identify them here.
   */
  const childSessionIds = new Set<string>()

  return {
    event: async ({ event }) => {
      // Track which sessions are sub-agents by watching session.created.
      // Sub-agent sessions have a parentID; primary sessions do not.
      if (event.type === "session.created") {
        const info = (event as { type: string; properties: { info: { id: string; parentID?: string } } }).properties.info
        if (info.parentID) {
          childSessionIds.add(info.id)
        }
        return
      }

      // Clean up tracking when a session is removed.
      if (event.type === "session.deleted") {
        const info = (event as { type: string; properties: { info: { id: string } } }).properties.info
        childSessionIds.delete(info.id)
        return
      }

      // Notify when the primary agent finishes its turn.
      // Ignore sub-agent idle events to avoid notification spam (see GitHub #13334).
      if (event.type === "session.idle") {
        const { sessionID } = (event as { type: string; properties: { sessionID: string } }).properties
        if (childSessionIds.has(sessionID)) {
          return
        }
        sendTerminalNotification("OpenCode: Agent finished")
        return
      }

      // Notify when the agent needs permission to proceed.
      if (event.type === "permission.asked") {
        const { permission } = (event as { type: string; properties: { permission: string } }).properties
        sendTerminalNotification(`OpenCode: Permission needed — ${permission}`)
        return
      }
    },
  }
}
