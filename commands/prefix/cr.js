module.exports = {
    name: 'cr',

    async execute (message) {
        const hasRole = message.member.roles.cache.has("1510895902548692992");
        const isAdmin = message.member.permissions.has("Administrator");
        if (!hasRole && !isAdmin) {
            return;
        }
        const [userId] = (message.channel.topic || "").split("|");
        await message.delete();
        await message.channel.send({
        "flags": 32768,
        "components": [
          {
            "type": 17,
            "components": [
              {
                "type": 10,
                "content": `# <:bell:1503469398676209820> Close Request\n<@${userId}>`
              },
              {
                "type": 14,
                "spacing": 2
              },
              {
                "type": 10,
                "content": "Our team feels you do not need further assistance. If you do not need further assistance, please click the 'Close' button promptly. If you still need further assistance, feel free to click the 'Keep Open' button, and our team will assist you as soon as possible."
              },
              {
                "type": 14,
                "divider": false
              },
              {
                "type": 1,
                "components": [
                  {
                    "style": 4,
                    "type": 2,
                    "label": "Close",
                    "custom_id": "close_ticket"
                  },
                  {
                    "style": 3,
                    "type": 2,
                    "custom_id": "keep_open",
                    "flow": {
                      "actions": []
                    },
                    "label": "Keep Open"
                  }
                ]
              },
              {
                "type": 14,
                "spacing": 2
              },
              {
                "type": 12,
                "items": [
                  {
                    "media": {
                      "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a1e7b7f&is=6a1d29ff&hm=96dc3d9b81f4097813b006c3055bb9eee59f0926665d2ca4b4a465530f6d6258&=&format=webp&quality=lossless"
                    }
                  }
                ]
              }
            ]
          }
        ]
      })
    }
}