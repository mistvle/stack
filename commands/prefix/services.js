module.exports = {
    name: "services",
    
    async execute (message) {
        if (!message.member.permissions.has("Administrator")) {
            return;
        }
        await message.delete();
        const channel = message.guild.channels.cache.get("1503425345783726192");
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
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896449020231700/Services.png?ex=6a1e7b78&is=6a1d29f8&hm=0b1839f6f8ef4b26fb235b9c402f65d73581b8de299c4669f706c53ad0735de6&=&format=webp&quality=lossless"
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
          "content": "If you're looking to order with **Stack Dev**, ensure to review our Order Terms below. By opening an order, you agree to our Order Terms & that your ticket will be closed with no notice or refund if terms are violated. Order using the button below. Ensure to submit detailed & accurate information to make it easier for our team."
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
              "label": "Order",
              "flow": {
                "actions": []
              },
              "custom_id": "order"
            },
            {
              "style": 2,
              "type": 2,
              "label": "Order Terms",
              "flow": {
                "actions": []
              },
              "custom_id": "order_terms"
            }
          ]
        }
      ]
    }
  ]
})
    }
}