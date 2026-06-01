module.exports = {
    customId: "order_terms",

    async execute(interaction) {

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
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510907544800071720/Order_Terms.png?ex=6a1e85cd&is=6a1d344d&hm=6a36ec9010e1166379460a7d3fff7dd9c39cea1bf73d109f13fdee35557a0215&=&format=webp&quality=lossless"
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
          "content": " ` #1 ` **Refunds**\n- No refunds will be offered unless an error on our part occurs.\n- All sales are final.\n\n` #2 ` **Payment Before Product**\n- You are required to pay before your designer starts to work on your order.\n- There are no exceptions - 100% must be paid.\n\n` #3 ` **Queue**\n- When ordering,  your order may be delayed due to an influx of the amount of orders for that service type.\n- The queue is decided on a first-come-first-serve basis. You can pay more for priority.\n\n` #4 ` **Respect**\n- You are required to be respectful at all times within your order.\n- Additionally, patience is expected. Constantly pinging Mistle or anyone else within your order is not permitted.\n\n` #5 ` **Common Sense**\n- Use your common sense all times during your order.\n- Acting braindead is not permitted.\n\n**Disclaimer:** Your designer has the right to refuse service to you for any reason deemed fit."
        }
      ]
    }
  ]
})
    }
}