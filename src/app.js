const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./botconfig.json");
const upsert = require('bookshelf-upsert')

const knex = require("knex")({
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'mysecretpassword',
    database: 'postgres',
    charset: 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(upsert);

var User = bookshelf.Model.extend({
  tableName: 'users'
});

var Guild = bookshelf.Model.extend({
  tableName: 'guilds'
});

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);

  client.guilds.forEach(guild =>{
    new Guild({guildid: guild.id, guildname: guild.name}).where('guildid', guild.id).upsert().then(rows => {
      guild.members.forEach(member =>{
        if(!member.user.bot) {
          new User({guildid: guild.id, userid: member.user.id, username: member.user.username, avatar: member.user.avatarURL }).where('userid', member.user.id).upsert().then(users =>{
            console.log(users);
          })
        }
      })
    })
  })
});

client.on("guildCreate", guild => {
});

client.on("guildDelete", guild => {
});

client.on("guildMemberAdd", member => {
  new User({userid: member.user.id, username: member.user.username, avatar: member.user.avatarURL}).where('userid', member.user.id).upsert().then({

  });
})

client.on("message", async message => {
  //do not process messages from bots
  if(message.author.bot) return;

  


  if(message.isMentioned(client.user)) {
  }
});

client.on("error", err => {
  console.error(err);
})

client.login(config.token);