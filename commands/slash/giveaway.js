const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const giveawayManager = require("../../utils/giveawayManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Manage giveaways.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("create")
                .setDescription("Create a giveaway.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("end")
                .setDescription("End a giveaway.")
                .addStringOption(option =>
                    option
                        .setName("id")
                        .setDescription("Input the giveaway ID.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("reroll")
                .setDescription("Reroll a giveaway.")
                .addStringOption(option =>
                    option
                        .setName("id")
                        .setDescription("Input the giveaway ID.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("View a giveaway.")
                .addStringOption(option =>
                    option
                        .setName("id")
                        .setDescription("Input the giveaway ID.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const isAdmin = interaction.member.permissions.has("Administrator");

        if (!isAdmin) {
            return interaction.reply({
                content: `${giveawayManager.XMARK} You do not have permission to run this command.`,
                flags: 64
            });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "create") {
            const modal = new ModalBuilder()
                .setCustomId("giveaway_create_modal")
                .setTitle("Create Giveaway");

            const prize = new TextInputBuilder()
                .setCustomId("prize")
                .setLabel("Prize")
                .setPlaceholder("500 R$")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const duration = new TextInputBuilder()
                .setCustomId("duration")
                .setLabel("Duration")
                .setPlaceholder("Example: 30s, 10m, 1h, 2d, 1w")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const winners = new TextInputBuilder()
                .setCustomId("winners")
                .setLabel("Winners")
                .setPlaceholder("Example: 1")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(prize),
                new ActionRowBuilder().addComponents(duration),
                new ActionRowBuilder().addComponents(winners)
            );

            return interaction.showModal(modal);
        }

        const id = interaction.options.getString("id").toUpperCase();
        const giveaway = interaction.client.db.prepare("SELECT * FROM giveaways WHERE id = ?").get(id);

        if (!giveaway) {
            return interaction.reply({
                content: `${giveawayManager.XMARK} No giveaway found with ID **${id}**.`,
                flags: 64
            });
        }

        if (subcommand === "end") {
            if (giveaway.ended === 1) {
                return interaction.reply({
                    content: `${giveawayManager.XMARK} That giveaway has already ended.`,
                    flags: 64
                });
            }

            await giveawayManager.endGiveaway(interaction.client, id);

            return interaction.reply({
                content: `${giveawayManager.CHECK} **Successfully** ended giveaway **${id}**.`,
                flags: 64
            });
        }

        if (subcommand === "reroll") {
            const entries = JSON.parse(giveaway.entries || "[]");

            if (!entries.length) {
                return interaction.reply({
                    content: `${giveawayManager.XMARK} This giveaway has no entries to reroll.`,
                    flags: 64
                });
            }

            const winners = giveawayManager.pickWinners(entries, giveaway.winner_count);

            interaction.client.db.prepare("UPDATE giveaways SET winners = ?, ended = 1 WHERE id = ?")
                .run(JSON.stringify(winners), id);

            const updated = interaction.client.db.prepare("SELECT * FROM giveaways WHERE id = ?").get(id);
            await giveawayManager.updateGiveawayMessage(interaction.client, updated);

            return interaction.reply(`${giveawayManager.CHECK} Giveaway **${id}** was rerolled. New winner(s): ${winners.map(w => `<@${w}>`).join(", ")}`);
        }

        if (subcommand === "view") {
            const entries = JSON.parse(giveaway.entries || "[]");
            const winners = JSON.parse(giveaway.winners || "[]");

            return interaction.reply({
                content:
                    `# <:confetti:1511071100363210886> Giveaway ${giveaway.id}\n` +
                    `**Prize:** ${giveaway.prize}\n` +
                    `**Status:** ${giveaway.ended === 1 ? "Ended" : "Active"}\n` +
                    `**Entries:** ${entries.length}\n` +
                    `**Winner Count:** ${giveaway.winner_count}\n` +
                    `**Ends:** <t:${Math.floor(giveaway.end_time / 1000)}:R>\n` +
                    `**Winners:** ${winners.length ? winners.map(w => `<@${w}>`).join(", ") : "None"}`,
                flags: 64
            });
        }
    }
};