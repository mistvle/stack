module.exports = {
    name: 'payment',

    async execute (message) {
        await message.reply({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": "# <:wallet:1510911931735740457> USD Payment"
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": "Looking to donate USD or pay for your order? Pay using the button below. Keep in mind that no refunds will be offered unless an error occurs on our side, so ensure to think carefully on the amount your paying, etc. Any payment errors such as sending too much money will not result in a refund & is completely on you."
        },
        {
          "type": 14,
          "divider": false
        },
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Payment",
              "url": "https://buymeacoffee.com/mistvle",
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