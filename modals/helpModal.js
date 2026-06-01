const {
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  customId: "help_modal",

  async execute(interaction) {
    const CATEGORY_ID = "1503425665901264998";
    const STAFF_ROLE_IDS = ["1503107376105001060", "1510895902548692992"];

    const reason = interaction.fields.getTextInputValue("help_reason");

    const username = interaction.user.username
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const existing = interaction.guild.channels.cache.find(
      c => c.topic === interaction.user.id
    );

    if (existing) {
      return interaction.reply({
        content: `<:xMark:1503593360995254383> You already have an open ticket: ${existing}`,
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
      name: `help-${username}`,
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
          "content": `<:check:1503593424299753555> Your ticket has been created successfully: ${channel}`
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
                "url": "https://media.discordapp.net/attachments/1510896301028409465/1510896469433913375/Support.png?ex=6a1e7b7d&is=6a1d29fd&hm=fc5d03ee6c86c9fe6371f71be3d36d7a5e74f06e733b96c745cab3afc81d7777&=&format=webp&quality=lossless"
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
          "content": "<:bell:1503469398676209820> A new support ticket has been opened. Ensure to assist the user with their inquiries promptly.\n\n**Ticket Guidelines**\n- Remain respectful & patient with our team\n- Do not ping members of our team; they have already been notified of your ticket being opened\n- Our team's decision is final; arguing about it is not permitted.\n\n**Inquiry:** ${reason}"
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
              "label": "Claim",
              "flow": {
                "actions": []
              },
              "custom_id": "claim_ticket"
            },
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