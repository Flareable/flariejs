require("dotenv").config();
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const keep_alive = require('./keep_alive.js')

// Tambahan variabel yang belum ada
const bannedWords = [
  "nigga", "nigg4", "n1gg4", "fuck", "stfu", "kontol", "k0nt0l", "nigga", "nigg4", "n1gga", "niqqa", "n!gga", "n1gg@", "n!gg@", "n!gg4", "nlgga",
    "fuck", "f*ck", "f@ck", "fuc*", "fucc", "fuk", "fck", "fuxk",
    "motherfucker", "m0therfucker", "motherf*cker", "moth3rfucker", "m0th3rf*cker",
    "bitch", "b!tch", "bi7ch", "b1tch", "b*tch", "biatch", "b!@tch",
    "asshole", "4sshole", "a$$hole", "ashole", "a55hole", "as$hole",
    "dick", "d1ck", "d!ck", "d*ck", "d!c*", "d1c*",
    "pussy", "dower", "p*ssy", "pu55y", "p@ssy", "p*55y",
    "suck my ass", "suck my d", "suck my d*ck", "suck my p*ssy", "lick my", "suck ur mom",
    "go to hell", "burn in hell", "die b*tch", "f you", "fuk u", "fck u",
    "stfu", "s-t-f-u", "stf*", "shut the fuck up",
    "kontol", "k0ntol", "k0ntl", "k*ntol", "kuntul", "kont*l", "k0nt*l",
    "memek", "m3m3k", "m3mek", "me***", "m3***", "m3m3*", "m*m3k",
    "ngentot", "ng3ntot", "ngent0t", "ng3nt0t", "ng*ntot", "ng*nt0t", "ngntt", "nge**",
    "anjing", "anj1ng", "4njing", "anji*ng", "anj!ng", "anji**", "anying",
    "bangsat", "b4ngsat", "bangs4t", "bangs@t", "b@ngsat", "bangs*t", "bangke", "bangkek",
    "tai", "t@i", "t4i", "ta1", "t4!",
    "bajingan", "b4jingan", "b@jingan", "baj1ngan", "b*jingan",
    "kampret", "kampr3t", "k4mpr3t", "k4mpret", "k4mpr3d", "kamp**",
    "goblok", "g0blok", "g*blok", "gob**k", "gblk", "g0bl0k", "gobl0k",
    "tolol", "t0l0l", "t*l*l", "tll", "t0l*l",
    "idiot", "idi0t", "id!ot", "idi0t", "1diot",
    "bego", "beg0", "b3g0", "b*g0", "bg0",
    "jancok", "j4ncok", "j@nco*k", "janc0k", "j4nc0k", "j4nck", "janco*k",
    "bitch ass", "fuck u", "bego lu", "lu goblok", "dasar tolol", "dasar anjing",
    "lu tai", "anjing lu", "ngentot lu", "memek lu", "kontol lu", "fuck this", "bitch please", "täï"
];

const protectedUsers = [
  "aether_100", "Flareable"
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
function normalizeText(text) {
  return text.normalize("NFD") // Pisah karakter dengan accent-nya
             .replace(/[\u0300-\u036f]/g, "") // Hapus accent-nya
             .replace(/[àáâãäåāæ]/g, "a")
             .replace(/[èéêëēėę]/g, "e")
             .replace(/[ìíîïīį]/g, "i")
             .replace(/[òóôõöøō]/g, "o")
             .replace(/[ùúûüū]/g, "u")
             .replace(/[çč]/g, "c")
             .replace(/[ñń]/g, "n")
             .replace(/[ß]/g, "ss")
             .replace(/[ýÿ]/g, "y");
}
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  
  const msg = normalizeText(message.content.toLowerCase());
  const username = message.author.username;

  // Auto-ban system
  if (bannedWords.some(word => msg.includes(word))) {
    if (protectedUsers.includes(username)) {
      message.channel.send(`${message.author} waduh tuan Flareable, kamu toxic ya, tapi kamu penciptaku, jadi tidak kuban.`)
        .catch(console.error);
      return;
    }

    try {
      await message.member.ban({ reason: "Toxic language detected." });
      await message.channel.send(`${message.author} telah dibanned karena toxic!\n**User has been banned** for using offensive language!`);
    } catch (error) {
      if (error.code === 50013) {
        await message.channel.send("Waduh, nggak bisa ban dia. Dia mungkin owner atau punya role dewa.");
      } else {
        console.error(error);
      }
    }
    return;
  }

  // Manual moderation commands by protected user
  if (username !== "aether_100") return;

  const mentionedUser = message.mentions.members.first();
  if (!mentionedUser) return;

  const command = msg;

  if (command.startsWith("!ban")) {
    try {
      await mentionedUser.ban({ reason: `Banned by ${message.author.tag}` });
      await message.author.send(`User ${mentionedUser.user.tag} berhasil diban.`);
      await message.delete();
    } catch (err) {
      await message.author.send(`Gagal ban ${mentionedUser.user.tag}: ${err.message}`);
    }
  } else if (command.startsWith("!kick")) {
    try {
      await mentionedUser.kick(`Kicked by ${message.author.tag}`);
      await message.author.send(`User ${mentionedUser.user.tag} berhasil dikick.`);
      await message.delete();
    } catch (err) {
      await message.author.send(`Gagal kick ${mentionedUser.user.tag}: ${err.message}`);
    }
  } else if (command.startsWith("!timeout")) {
    const durationMs = 10 * 60 * 1000; // 10 menit
    try {
      await mentionedUser.timeout(durationMs, `Timed out by ${message.author.tag}`);
      await message.author.send(`User ${mentionedUser.user.tag} di-timeout selama 10 menit.`);
      await message.delete();
    } catch (err) {
      await message.author.send(`Gagal timeout ${mentionedUser.user.tag}: ${err.message}`);
    }
  } else if (command.startsWith("!untimeout")) {
  try {
    // Cek apakah user sedang timeout (biar gak asal clear)
    if (!mentionedUser.communicationDisabledUntil) {
      await message.author.send(`${mentionedUser.user.tag} nggak lagi di-timeout.`);
    } else {
      await mentionedUser.disableCommunicationUntil(null); // Ini yang ngehapus timeout-nya
      await message.author.send(`${mentionedUser.user.tag} berhasil di-untimeout.`);
    }

    await message.delete(); // Hapus command dari server biar bersih
  } catch (err) {
    await message.author.send(`Gagal untimeout ${mentionedUser.user.tag}: ${err.message}`);
  }
}
});

client.login(process.env.DISCORD_TOKEN);