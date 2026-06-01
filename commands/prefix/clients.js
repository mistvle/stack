module.exports = {
    name: "clients",

    async execute (message) {
        const isAdmin = message.member.permissions.has("Administrator");
        if (!isAdmin) {
            return;
        }
        await message.delete();
        const channel = message.guild.channels.cache.get("1503425401299533934");
        await channel.send({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 12,
          "items": [
            {
              "media": {
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896406859087902/Clients.png?ex=6a1e7b6e&is=6a1d29ee&hm=5dc4abedead33077b8e625a6f5bab02ab0b660dbc7979c60f6c52e12ef2716b1&=&format=webp&quality=lossless&width=1100&height=330"
              }
            }
          ]
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": "Welcome to the clients section. Below, you can view all the clients Mistle has created bots for.\n\n- [Kentucky State Roleplay](https://discord.gg/kensrp) - 8500+\n- [South Carolina State Roleplay](https://discord.gg/scstate) - 6000+ (department)\n- [Klopp's Commissions](https://discord.gg/sMBXp3N6QM)"
        }
      ]
    }
  ]
})
    }
}