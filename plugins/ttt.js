const { cmd } = require('../command'); const TicTacToe = require('../inconnuboy/tictactoe');

const games = {};

cmd({ pattern: "ttt", alias: ["tictactoe"], desc: "🎮 Lance une partie de morpion", category: "game", filename: __filename, }, async (conn, mek, m, { from, sender, args, reply }) => { const text = args.join(' ');

if (Object.values(games).find(room => room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender))) {
    return reply('❌ Tu es déjà dans une partie.\nTape *surrender* pour abandonner.');
}

let room = Object.values(games).find(room =>
    room.state === 'WAITING' && (text ? room.name === text : true));

if (room) {
    room.o = from;
    room.game.playerO = sender;
    room.state = 'PLAYING';

    const arr = formatBoard(room.game.render());
    const str = formatBoardMessage(arr, room.game.currentTurn, room.game.playerX, room.game.playerO);

    await conn.sendMessage(from, {
        text: str,
        mentions: [room.game.playerX, room.game.playerO],
    });
} else {
    room = {
        id: 'tictactoe-' + Date.now(),
        x: from,
        o: '',
        game: new TicTacToe(sender),
        state: 'WAITING',
    };

    if (text) room.name = text;
    games[room.id] = room;

    return reply(`🎮 Nouveau jeu lancé !\n⏳ En attente d'un adversaire...\n➡️ Tape *.ttt ${text || ''}* pour rejoindre la partie.`);
}

});

cmd({ custom: true, desc: "🎮 Action de jeu TicTacToe", fromMe: false, type: "game", }, async (conn, mek, m, { body, sender, from, reply }) => { if (!/^[1-9]$|^surrender$|^give up$/i.test(body)) return;

const room = Object.values(games).find(room =>
    room.id.startsWith('tictactoe') &&
    [room.game.playerX, room.game.playerO].includes(sender) &&
    room.state === 'PLAYING'
);
if (!room) return;

const isSurrender = /^(surrender|give up)$/i.test(body);
const isPlayerO = sender === room.game.playerO;

if (!isSurrender && sender !== room.game.currentTurn) {
    return reply('❌ Ce n’est pas ton tour.');
}

let validMove = isSurrender ? true : room.game.turn(isPlayerO, parseInt(body) - 1);
if (!validMove && !isSurrender) {
    return reply('⚠️ Case déjà prise. Choisis une case vide.');
}

let winner = room.game.winner;
const isTie = room.game.turns === 9;
const arr = formatBoard(room.game.render());

if (isSurrender) {
    winner = sender === room.game.playerX ? room.game.playerO : room.game.playerX;
    await conn.sendMessage(from, {
        text: `🏳️ @${sender.split('@')[0]} a abandonné.\n🏆 Victoire de @${winner.split('@')[0]} !`,
        mentions: [sender, winner]
    });
    delete games[room.id];
    return;
}

const status = winner
    ? `🏆 @${winner.split('@')[0]} remporte la victoire !`
    : isTie
        ? `🤝 Match nul !`
        : `🎯 Tour de @${room.game.currentTurn.split('@')[0]}`;

const str = formatBoardMessage(arr, status, room.game.playerX, room.game.playerO);

for (const jid of [room.x, room.o]) {
    if (jid) {
        await conn.sendMessage(jid, {
            text: str,
            mentions: [room.game.playerX, room.game.playerO, ...(winner ? [winner] : [])]
        });
    }
}

if (winner || isTie) delete games[room.id];

});

// 📦 Fonctions utilitaires

function formatBoard(rendered) { return rendered.map(v => ({ 'X': '❎', 'O': '⭕', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣', }[v])); }

function formatBoardMessage(arr, status, playerX, playerO) { return ` ╭───🎮 TicTacToe ───╮ │ │ ${arr.slice(0, 3).join('')} │ ${arr.slice(3, 6).join('')} │ ${arr.slice(6).join('')} │ ├───✨ Infos ─── │ ❎ : @${playerX.split('@')[0]} │ ⭕ : @${playerO.split('@')[0]} │ ├───🔄 Statut ─── │ ${status} ╰────────────────────

🕹️ Tape un chiffre (1-9) pour jouer 🏳️ Tape surrender pour abandonner `; }

                                       
