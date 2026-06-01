module.exports = {
    name: 'dashboard',

    async execute (message) {
        if (!message.member.permissions.has("Administrator")) {
            return;
        }

        await message.delete();
        const channel = message.guild.channels.cache.get("1503424758061203536");
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
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896365654245537/Dashboard.png?ex=6a1e7b64&is=6a1d29e4&hm=bb4b3946344e01bd0ae650ef2c640949ad345d1ee8d356b14e45f5a48081cd3b&=&format=webp&quality=lossless"
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
          "content": "Welcome to **Stack Dev** — a hub for ER:LC development products. You can order bots & purchase packages for the cheapest prices, along with advanced courses to learn how to incorporate advanced features within your code. Learn more by clicking the button below, or contact our team if you have questions."
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
              "label": "Contact",
              "flow": {
                "actions": []
              },
              "custom_id": "help"
            },
            {
              "style": 2,
              "type": 2,
              "label": "Learn More",
              "flow": {
                "actions": []
              },
              "custom_id": "learn_more"
            },
            {
              "style": 2,
              "type": 2,
              "label": "Guidelines",
              "flow": {
                "actions": []
              },
              "custom_id": "guidelines"
            },
            {
              "type": 2,
              "style": 5,
              "url": "https://www.roblox.com/communities/1089350035/Stack-Dev#!/about",
              "label": "Group"
            }
          ]
        }
      ]
    }
  ]
})
    }
}