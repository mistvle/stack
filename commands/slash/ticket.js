const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const STAFF_ROLE_ID = "1499678975964745840";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket management")

    .addSubcommand(sub =>
      sub.setName("rename")
        .setDescription("Rename a ticket.")
        .addStringOption(opt =>
          opt.setName("name").setDescription("Input the new name of the ticket.").setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub.setName("add")
        .setDescription("Add a user or role to the ticket.")
        .addUserOption(opt => opt.setName("user").setDescription("Select the user to add."))
        .addRoleOption(opt => opt.setName("role").setDescription("Select the role to add."))
    )

    .addSubcommand(sub =>
      sub.setName("remove")
        .setDescription("Remove a user or role from the ticket.")
        .addUserOption(opt => opt.setName("user").setDescription("Select the user to remove."))
        .addRoleOption(opt => opt.setName("role").setDescription("Select the role to remove."))
    )

    .addSubcommand(sub =>
      sub.setName("close").setDescription("Close the ticket.")
    )

    .addSubcommand(sub =>
      sub.setName("closerequest").setDescription("Send a close request.")
    ),

  async execute(interaction) {

    const sub = interaction.options.getSubcommand();
    const channel = interaction.channel;

    const isAdmin = interaction.member.permissions.has("Administrator");
    const hasRole = interaction.member.roles.cache.has("1510895902548692992");

    if (!hasRole && !isAdmin) {
      return interaction.reply("<:xMark:1503593360995254383> You must be an employee to use this command.");
    }

    if (!channel.topic || !/^\d+(\|\d+)?$/.test(channel.topic)) {
      return interaction.reply({
        content: "<:xMark:1503593360995254383> This command must be used in a ticket.",
        flags: 64
      });
    }

    if (sub === "rename") {
      const name = interaction.options.getString("name");

      await channel.setName(name);

      return interaction.reply({
        content: `<:check:1503593424299753555> **Successfully** renamed ticket to **${name}**.`,
        flags: 64
      });
    }

    if (sub === "add") {
      const user = interaction.options.getUser("user");
      const role = interaction.options.getRole("role");

      if (!user && !role) {
        return interaction.reply({
          content: "<:xMark:1503593360995254383> Failed to detect a valid user or role.",
          flags: 64
        });
      }

      if (user) {
        await channel.permissionOverwrites.edit(user.id, {
          ViewChannel: true,
          SendMessages: true
        });

        return interaction.reply({
          content: `<:check:1503593424299753555> **Successfully** added ${user} to the ticket.`,
          flags: 64
        });
      }

      if (role) {
        await channel.permissionOverwrites.edit(role.id, {
          ViewChannel: true,
          SendMessages: true
        });

        return interaction.reply({
          content: `<:check:1503593424299753555> **Successfully** added ${role} to the ticket.`,
          flags: 64
        });
      }
    }

    if (sub === "remove") {
      const user = interaction.options.getUser("user");
      const role = interaction.options.getRole("role");

      if (!user && !role) {
        return interaction.reply({
          content: "<:xMark:1503593360995254383> Failed to detect a valid user or role.",
          flags: 64
        });
      }

      if (user) {
        await channel.permissionOverwrites.delete(user.id);

        return interaction.reply({
          content: `<:check:1503593424299753555> **Successfully** removed ${user} from the ticket.`,
          flags: 64
        });
      }

      if (role) {
        await channel.permissionOverwrites.delete(role.id);

        return interaction.reply({
          content: `<:check:1503593424299753555> **Successfully** removed ${role} from the ticket.`,
          flags: 64
        });
      }
    }

    const discordTranscripts = require("discord-html-transcripts");

    if (sub === "close") {

      const [ownerId] = (channel.topic || "").split("|");

      await interaction.reply({
        "flags": 32832,
        "components": [
          {
            "type": 17,
            "components": [
              {
                "type": 10,
                "content": "<a:loading:1503597542103846942> Closing ticket..."
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

      const user = await interaction.client.users.fetch(ownerId).catch(() => null);

      if (user) {
        await user.send({
          "flags": 32768,
          "components": [
            {
              "type": 17,
              "components": [
                {
                  "type": 10,
                  "content": "# <:bell:1503469398676209820> Ticket Closed"
                },
                {
                  "type": 10,
                  "content": "Your ticket in **Stack Dev** has been closed. If you need further assistance, do not hesitate to contact us again. We hope you enjoyed your experience with our team."
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
        }).catch(() => {});
      }

      const messages = await channel.messages.fetch({ limit: 10 });

      const panel = messages.find(m =>
        m.components?.[0]?.components?.some(c =>
          c.content?.includes("Ticket Details")
        )
      );

      let inquiry = "N/A";

      if (panel) {

        const textBlock = panel.components[0].components.find(c =>
          c.content?.includes("Ticket Details")
        );

        if (textBlock) {

          const content = textBlock.content;

          if (
            channel.name.startsWith("help-") ||
            channel.name.startsWith("aa-")
          ) {

            const lines = content.split("\n");

            const inquiryLine = lines.find(line =>
              line.includes("Inquiry:")
            );

            if (inquiryLine) {
              inquiry = inquiryLine.replace("- Inquiry:", "").trim();
            }
          }

          if (channel.name.startsWith("ia-")) {

            const lines = content.split("\n");

            const callsign =
              lines.find(l => l.includes("Deputy Callsign:"))
              ?.replace("- Deputy Callsign:", "")
              ?.trim() || "N/A";

            const username =
              lines.find(l => l.includes("Deputy Username:"))
              ?.replace("- Deputy Username:", "")
              ?.trim() || "N/A";

            const reason =
              lines.find(l => l.includes("Reason:"))
              ?.replace("- Reason:", "")
              ?.trim() || "N/A";

            inquiry =
`Deputy Callsign: ${callsign}
Deputy Username: ${username}
Reason: ${reason}`;
          }
        }
      }

      const attachment = await discordTranscripts.createTranscript(channel, {
        limit: -1,
        returnType: "attachment",
        filename: `transcript-${channel.id}.html`
      });

      const logChannel = interaction.guild.channels.cache.get("1510892452855419021");

      const embed = {
        title: "Ticket Closed",
        color: 4079169,
        image: {
          url: "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a1e7b7f&is=6a1d29ff&hm=96dc3d9b81f4097813b006c3055bb9eee59f0926665d2ca4b4a465530f6d6258&=&format=webp&quality=lossless"
        },
        description:
`A ticket has been closed. Review information regarding it below.

**Channel Name:** ${channel.name}
**Channel ID:** ${channel.id}
**Inquiry:** ${inquiry || "N/A"}

**Opened By:** <@${ownerId}>
**Closed By:** ${interaction.user}`
      };

      await logChannel.send({
        embeds: [embed],
        files: [attachment]
      });

      setTimeout(() => {
        channel.delete().catch(() => {});
      }, 2000);
    }

    if (sub === "closerequest") {

      const [userId] = (channel.topic || "").split("|");

      await channel.send({
        "flags": 32768,
        "components": [
          {
            "type": 17,
            "components": [
              {
                "type": 10,
                "content": `# <:fcso_qmark:1501770231524098119> Close Request\n<@${userId}>`
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
      });

      await interaction.reply({
        content: "<:check:1503593424299753555> **Successfully** sent close request.",
        flags: 64
      });
    }
  }
};