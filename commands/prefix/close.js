const discordTranscripts = require("discord-html-transcripts");

module.exports = {
  name: "close",

  async execute(message, args) {
    const isAdmin = message.member.permissions.has("Administrator");
    const hasRole = message.member.roles.cache.has("1510895902548692992");

    if (!isAdmin && !hasRole) {
      return message.reply("<:xMark:1503593360995254383> You must be an employee to close this ticket.");
    }

    if (!message.channel.topic || !/^\d+(\|\d+)?$/.test(message.channel.topic)) {
      return message.reply("<:xMark:1503593360995254383> You can only close a ticket.");
    }

    try {
      const channel = message.channel;

      const [ownerId] = (channel.topic || "").split("|");

      const user = await message.client.users
        .fetch(ownerId)
        .catch(() => null);

      if (user) {
        await user.send({
          flags: 32768,
          components: [
            {
              type: 17,
              components: [
                {
                  type: 10,
                  content: "# <:bell:1503469398676209820> Ticket Closed"
                },
                {
                  type: 10,
                  content: "Your ticket in **Stack Dev** has been closed. If you need further assistance, do not hesitate to contact us again. We hope you enjoyed your experience with our team."
                },
                {
                  type: 14,
                  spacing: 2
                },
                {
                  type: 12,
                  items: [
                    {
                      media: {
                        url: "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a1e7b7f&is=6a1d29ff&hm=96dc3d9b81f4097813b006c3055bb9eee59f0926665d2ca4b4a465530f6d6258&=&format=webp&quality=lossless"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }).catch(() => {});
      }

      await message.reply("<a:loading:1503597542103846942> Closing ticket...");

      const logChannel = message.guild.channels.cache.get("1510892452855419021");

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
**Closed By:** ${message.author}`
      };

      await logChannel.send({
        embeds: [embed],
        files: [attachment]
      });

      setTimeout(() => {
        channel.delete().catch(() => {});
      }, 3000);

    } catch (err) {
      console.error(err);
      return message.reply("<:xMark:1503593360995254383> An error occurred.").catch(() => {});
    }
  }
};