module.exports = {
    name: 'reminder',

    async execute (message) {
        const isAdmin = message.member.permissions.has("Administrator");
        const hasRole = message.member.roles.cache.has("1510895902548692992");
        if (!isAdmin && !hasRole) {
            return;
        }
        const userId = message.channel.topic;
        await message.delete();
        await message.channel.send({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": `# Reminder\n-# <@${userId}>`
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": "Our team is reminding you to respond to ensure your ticket does not get closed. If you fail to respond within 12 hours of this message, your ticket will be closed. If this is an order, no refund will be offered if your ticket is closed, as said in our Order Terms."
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
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a21c73f&is=6a2075bf&hm=2cfcd8ecff0551962f6a2a47222d2c531c6393a93ee752d458df7c143b8976df&=&format=webp&quality=lossless"
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