const discordTranscripts = require("discord-html-transcripts");

module.exports = {
  customId: "crclose",

  async execute(interaction) {

    const isAdmin = interaction.member.permissions.has("Administrator");
    const hasRole = interaction.member.roles.cache.has("1503255439947595948");

    if (!isAdmin && !hasRole) {
      return interaction.reply({
        content: "<:xMark:1503593360995254383> You must be an employee to close this ticket.",
        flags: 64
      });
    }

    if (!interaction.channel.topic || !/^\d+(\|\d+)?$/.test(interaction.channel.topic)) {
      return interaction.reply({
        content: "<:xMark:1503593360995254383> You can only close a ticket.",
        flags: 64
      });
    }

    try {

      const channel = interaction.channel;

      const [ownerId] = (channel.topic || "").split("|");

      const user = await interaction.client.users
        .fetch(ownerId)
        .catch(() => null);

      // =========================
      // DM USER
      // =========================
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

      await interaction.reply({
        content: "<a:loading:1503597542103846942> Closing ticket...",
        flags: 64
      });

      const logChannel = interaction.guild.channels.cache.get("1510892452855419021");

      // =========================
      // GET TICKET DETAILS
      // =========================
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

          // GENERAL / ADMIN
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

          // IA
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

      // =========================
      // TRANSCRIPT
      // =========================
      const attachment = await discordTranscripts.createTranscript(channel, {
        limit: -1,
        returnType: "attachment",
        filename: `transcript-${channel.id}.html`
      });

      // =========================
      // LOG EMBED
      // =========================
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

      // =========================
      // DELETE CHANNEL
      // =========================
      setTimeout(() => {
        channel.delete().catch(() => {});
      }, 3000);

    } catch (err) {
      console.error(err);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "<:xMark:1503593360995254383> An error occurred.",
          flags: 64
        }).catch(() => {});
      } else {
        await interaction.reply({
          content: "<:xMark:1503593360995254383> An error occurred.",
          flags: 64
        }).catch(() => {});
      }
    }
  }
};