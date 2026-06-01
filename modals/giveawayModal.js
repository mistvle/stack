const giveawayManager = require("../utils/giveawayManager");

module.exports = {
    customId: "giveaway_create_modal",

    async execute(interaction) {
        const prize = interaction.fields.getTextInputValue("prize");
        const duration = interaction.fields.getTextInputValue("duration");
        const winnersRaw = interaction.fields.getTextInputValue("winners");

        const durationMs = giveawayManager.parseDuration(duration);
        const winnerCount = parseInt(winnersRaw);
        console.log(duration);
console.log(durationMs);

        if (!durationMs) {
            return interaction.reply({
                content: `${giveawayManager.XMARK} Invalid duration. Use examples like **30s**, **10m**, **1h**, **2d**, or **1w**.`,
                flags: 64
            });
        }

        if (!winnerCount || winnerCount < 1) {
            return interaction.reply({
                content: `${giveawayManager.XMARK} Winner count must be a valid number above 0.`,
                flags: 64
            });
        }

        const id = giveawayManager.generateGiveawayId(interaction.client.db);
        const endTime = Date.now() + durationMs;

        interaction.client.db.prepare(`
            INSERT INTO giveaways 
            (id, message_id, channel_id, guild_id, prize, duration, winner_count, end_time, entries, ended, winners)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            "pending",
            interaction.channel.id,
            interaction.guild.id,
            prize,
            duration,
            winnerCount,
            endTime,
            "[]",
            0,
            "[]"
        );

        const giveaway = interaction.client.db.prepare("SELECT * FROM giveaways WHERE id = ?").get(id);

        await interaction.reply({
            content: `${giveawayManager.CHECK} **Successfully** created giveaway.`,
            flags: 64
        });

        const message = await interaction.channel.send(giveawayManager.buildGiveawayPayload(giveaway));

        interaction.client.db.prepare("UPDATE giveaways SET message_id = ? WHERE id = ?")
            .run(message.id, id);

        const updated = interaction.client.db.prepare("SELECT * FROM giveaways WHERE id = ?").get(id);
        giveawayManager.scheduleGiveaway(interaction.client, updated);
    }
};