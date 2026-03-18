// src/index.ts
function sendTerminalNotification(message) {
    process.stdout.write(`\x1B]9;${message}\x07`);
}
var TerminalNotifyPlugin = async () => {
    const childSessionIds = new Set();
    return {
        event: async ({ event }) => {
            if (event.type === "session.created") {
                const info = event.properties.info;
                if (info.parentID) {
                    childSessionIds.add(info.id);
                }
                return;
            }
            if (event.type === "session.deleted") {
                const info = event.properties.info;
                childSessionIds.delete(info.id);
                return;
            }
            if (event.type === "session.idle") {
                const { sessionID } = event.properties;
                if (childSessionIds.has(sessionID)) {
                    return;
                }
                sendTerminalNotification("OpenCode: Agent finished");
                return;
            }
            if (event.type === "permission.asked") {
                const { permission } = event.properties;
                sendTerminalNotification(`OpenCode: Permission needed \u2014 ${permission}`);
                return;
            }
        }
    };
};
export {
    TerminalNotifyPlugin
};

