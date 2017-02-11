e/*
  A ping pong bot, whenever you send "ping", it replies "pong".
  A logmerlixnet Bot, whatever you send "ping,twitter,add,WelcomeMessage,say"
*/

// import the discord.js module
const Discord = require('discord.js');

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

//Bot Config! #Prefix & Token
const config = require("./config.json");

// the token of your bot - https://discordapp.com/developers/applications/me
// const token = '(token)';

// the ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
//TODO New console.log Output:
bot.on('ready', () => {
  console.log('I am ready!');
});


//TODO Welcome Message
bot.on("guildMemberAdd", member => {
  let guild = member.guild
  guild.defaultChannel.sendMessage(`Welcome ${member.user} to this Server.`).catch(console.error);
});

bot.on("guildCreate", guild => {
  console.log(`New guild added : ${guild.name}, owned by $(guild.owner.user.username)`);
});


// Change Status / Check Game // Check Game / He Playing a Game?
bot.on("presenceUpdate", (oldMember, newMember) => {
  let guild = newMember.guild;
  let playRole = guild.roles.find("name", "Playing Minecraft");
  if (!playRole) return;

  if (newMember.user.presence.game && newMember.user.presence.game.name === "Minecraft") {
    newMember.addRole(playRole).catch(console.error);
  }else if (!newMember.user.presence.game && newMember.roles.has(playRole.id)) {
    newMember.removeRole(playRole).catch(console.error);
  }
});

// Set Prefix for command!
// const prefix = "!";

// create an event listener for messages
bot.on('message', message => {
  if(message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0]
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);
// if i write add then addiotion this
  if (command === "add") {
    let numArry = args.map(n=> parseInt(n));
    let total = numArry.reduce( (p, c) => p+c)
    message.channel.sendMessage(total).catch(console.error);
  }

  // if the message is say
  if (command == "say") {
      // sendMessage nach dem Comamnd "say"
    message.channel.sendMessage(args.join(" ")).catch(console.error);
  }

  // if the message is "ping",
  if (message.content.startsWith(config.prefix + "ping")) {
        // send "pong" to the same channel.
    message.channel.sendMessage('pong!').catch(console.error);
  } else

  if (message.content.startsWith(config.prefix + "foo")) {
    let modRole = message.guild.roles.find("name", "Mods");
    if (message.member.roles.has(modRole.id)) {
      message.channel.sendMessage("bar!").catch(console.error);
    } else {
      message.reply("You bleb, you don´t have the permissions to use this Command!").catch(console.error);
    }
  }

  if (message.content.startsWith(config.prefix + "kick")) {
    let modRole = message.guild.roles.find("name", "Mods");
      if (!message.member.roles.has(modRole.id)) {
      return message.reply("you bleb, you don´t have the permissions to use this Command!").catch(console.error);
    }
      //let (message.member.roles.has(modRole.id)) {
      if (message.mentions.users.size === 0) {
        return message.reply("Please mention a user to kick").catch(console.error);
    }
    let kickMember = message.guild.member(message.mentions.users.first());
    if (!kickMember) {
      return message.reply("That user does not seen valid").catch(console.error);
    }
    if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
      return message.reply("I don´t have the permissions (KICK_MEMBERS) to do this.").catch(console.error);
    }
    kickMember.kick().then(member => {
      message.reply(` the Player: ${member.user} was succesfully kicked.`).catch(console.error);
    }).catch(console.error);
  }

  if (message.content.startsWith(config.prefix + "eval")) {
    if (message.author.id !== "156473495348314113") return;
    try {
      var code = args.join(" ");
      var evaled = eval(code);
 
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
 
      message.channel.sendCode("xl", clean(evaled));
    } catch(err) {
      message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
   }

//TODO Avatar!
  // if the message is "what is my avatar",
  if (message.content.startsWith(config.prefix + "avatar")) {
    // send the user's avatar URL
    message.reply(message.author.avatarURL).catch(console.error);
  }

//TODO twitter APi
  //if the Prefix + Twiter write
  if (message.content.startsWith(config.prefix + "twitter")) {
    // then send this in this channel:
    message.channel.sendMessage("https://twitter.com/logmerlixnet").catch(console.error);
  }

//TODO TeamSpeak3 APi
  //if the Prefix + Twiter write
  if (message.content.startsWith(config.prefix + "ts")) {
    // then send this in this channel:
    message.channel.sendMessage("logmerlix.tk").catch(console.error);
    }

}); // END MESSAGE HANDLER

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
  }

  // log our bot in
  bot.login(config.token);

//TODO voiceChannel - MusicBot
const Discord-DJ = require('DiscordDJ');
var = music = new DiscordDJ();

music.on('ready', => {
  console.log('DiscordDJ is ready!');
});

// play streams using ytdl-core
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const broadcast = client.createVoiceBroadcast();

voiceChannel.join()
 .then(connection => {
   const stream = ytdl('https://www.youtube.com/watch?v=XAWgeLF9EVQ', {filter : 'audioonly'});
   broadcast.playStream(stream);
   const dispatcher = connection.playBroadcast(broadcast);
 })
 .catch(console.error);

//bot.on("voice", voiceChannel)
//bot.on("voice", voice => {
//  let voice = member.guild
//  guid.defaultChannel.sendMessage(`Welcome $(member.user) to this Server.`);
