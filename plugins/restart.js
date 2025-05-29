const { cmd } = require("../command");
const { sleep } = require("../inconnuboy/functions");

cmd({
    pattern: "restart",
    desc: "Restart QUEEN ASUNA",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("⛔ Only *Queen Asuna's owner* can use this command.");
        }

        const { exec } = require("child_process");

        await reply("♻️ *Restarting system modules...*");
        await sleep(1000);
        await reply("⚙️ *Shutting down QUEEN ASUNA...*");
        await sleep(1000);
        await reply("💻 *Rebooting AI core... Please wait.*");
        await sleep(1000);
        await reply("✅ *QUEEN ASUNA is restarting now...*");

        exec("pm2 restart all");

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});
