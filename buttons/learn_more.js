module.exports = {
    customId: "learn_more",

    async execute (interaction) {
        return interaction.reply({
  "flags": 32832,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 12,
          "items": [
            {
              "media": {
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896386722238584/Learn_More.png?ex=6a1e7b69&is=6a1d29e9&hm=ce1b6e81ae030ab720600113c359c6d0540c0afbe4afee36aead444d1d56cb5f&=&format=webp&quality=lossless"
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
          "content": "Stack Dev offers top-notch bots, coding packages, and an extremely advanced course for those looking to incorporate advanced features into their code. The course also has basic information for beginners who are looking to code. The main developer at Stack, <@1499915565538611401> has devloped bots for many large clients, which you can view in <#1503425401299533934>."
        }
      ]
    }
  ]
})
    }
}