module.exports = {
    name: "inprogress",

    async execute (message) {
        const isAdmin = message.member.permissions.has("Administrator");
        if (!isAdmin) {
            return;

        }


        const userId = message.channel.topic;
        const member = message.guild.members.fetch(userId);
        await member.roles.add("1503255440341864489");
        await message.delete();
        await message.reply({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": "# <:m_Heart:1504308082287575151> Order Completed"
        },
        {
          "type": 10,
          "content": `-# <@${userId}>`
        },
        {
          "type": 14,
          "divider": true,
          "spacing": 2
        },
        {
          "type": 10,
          "content": "Your order has been completed. Thank you for ordering with **Stack Dev**. We hope to see you return in the future if you need more bots or features. Ensure to refer us as your developer, and to give credits when do."
        },
        {
          "type": 14,
          "divider": false
        },
        {
          "type": 1,
          "components": [
            {
              "style": 1,
              "type": 2,
              "label": "Completed",
              "disabled": true,
              "flow": {
                "actions": []
              },
              "custom_id": "p_308636898354532355"
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
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a1e7b7f&is=6a1d29ff&hm=96dc3d9b81f4097813b006c3055bb9eee59f0926665d2ca4b4a465530f6d6258&=&format=webp&quality=lossless&width=3200&height=162"
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