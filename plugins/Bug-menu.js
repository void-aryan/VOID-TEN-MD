const { cmd } = require('../command');

cmd({
  pattern: "bug-menu",
  desc: "Show special Owner commands",
  category: "Owner",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  const menuBug = `
╭━❖ 〔 BUG MENU 〕❖━╮
┃ ✦ \`.ASUNA-BUG\`
┃ ✦ \`.INCONNU-CRASH\`
┃ ✦ \`.ASUNA-KILL\`
┃ ✦ \`.INCONNU-FREZZE\`
╰━━━━━━━━━━━━━━━━╯
`;

  const thumbnailUrl = 'https://files.catbox.moe/p1xybt.jpg';

  await conn.sendMessage(from, {
    image: { url: thumbnailUrl },
    caption: menuBug
  }, { quoted: mek });
});
