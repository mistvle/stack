const {
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  customId: "order_modal",

  async execute(interaction) {
    const CATEGORY_ID = "1503425738010005638";
    const STAFF_ROLE_IDS = ["1503107376105001060", "1510895902548692992"];

    const budget = interaction.fields.getTextInputValue("budget");
    const description = interaction.fields.getTextInputValue("description");
    const quantity = interaction.fields.getTextInputValue("quantity");

    const username = interaction.user.username
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const existing = interaction.guild.channels.cache.find(
      c => c.topic === interaction.user.id
    );

    if (existing) {
      return interaction.reply({
        content: `<:xMark:1503593360995254383> You already have an open order: ${existing}`,
        flags: 64
      });
    }

    const staffRoles = STAFF_ROLE_IDS
      .map(roleId => interaction.guild.roles.cache.get(roleId))
      .filter(role => role);

    console.log("Resolved roles:", staffRoles.map(r => `${r.name} (${r.id})`));

    const overwrites = [
      {
        id: interaction.guild.id,
        deny: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks
        ]
      },
      ...staffRoles.map(role => ({
        id: role.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.EmbedLinks,
          PermissionFlagsBits.ManageChannels
        ]
      }))
    ];

    const channel = await interaction.guild.channels.create({
      name: `order-${username}`,
      type: ChannelType.GuildText,
      parent: CATEGORY_ID,
      topic: interaction.user.id,
      permissionOverwrites: overwrites
    });

    await interaction.reply({
  ephemeral: true,
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": `<:check:1503593424299753555> Your order has been created successfully: ${channel}`
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
                "url": "https://media.discordapp.net/attachments/1503464946401542196/1503465528725999626/image.png?ex=6a0372e3&is=6a022163&hm=ee33865ea69c77fb8dc317ce76b2c328afb44487e638715ceadb0c0be9e55ed6&=&format=webp&quality=lossless"
              }
            }
          ]
        }
      ]
    }
  ]
});

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
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896423476920400/Order.png?ex=6a2075b2&is=6a1f2432&hm=c4fe7391c48e1b1931332e85fd2158734026aad5daa656ac22dcfad84685b216&=&format=webp&quality=lossless&width=550&height=165"
              }
            }
          ]
        },
        {
          "type": 10,
          "content": `-# @everyone | ${interaction.user}`
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": `<:bell:1503469398676209820> A new order has been opened. Review the order information below. Ensure to comply with all guidelines listed in our Order Terms section to avoid having your order closed.\n\n**Budget:** ${budget}\n**Quantity:** ${quantity}\n**Description:** ${description}`
        },
        {
          "type": 1,
          "components": [
            {
              "style": 4,
              "type": 2,
              "label": "Close",
              "flow": {
                "actions": []
              },
              "custom_id": "close_ticket"
            }
          ]
        }
      ]
    }
  ]
});
  }
};