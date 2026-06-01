const giveawayManager = require("../utils/giveawayManager");

module.exports = {
    customId: "giveaway_join",

    async execute(interaction) {
        try {
            console.log("BUTTON HIT:", interaction.customId);

            if (!interaction.customId.startsWith("giveaway_join_")) return;

            const id = interaction.customId.replace("giveaway_join_", "");

            console.log("GIVEAWAY ID:", id);
            console.log("DB EXISTS:", !!interaction.client.db);

            const giveaway = interaction.client.db
                .prepare("SELECT * FROM giveaways WHERE id = ?")
                .get(id);

            if (!giveaway) {
                return interaction.reply({
                    content: `${giveawayManager.XMARK} This giveaway no longer exists.`,
                    flags: 64
                });
            }

            if (giveaway.ended === 1 || giveaway.end_time <= Date.now()) {
                return interaction.reply({
                    content: `${giveawayManager.XMARK} This giveaway has already ended.`,
                    flags: 64
                });
            }

            let entries = JSON.parse(giveaway.entries || "[]");
            let joined;

            if (entries.includes(interaction.user.id)) {
                entries = entries.filter(userId => userId !== interaction.user.id);
                joined = false;
            } else {
                entries.push(interaction.user.id);
                joined = true;
            }

            interaction.client.db
                .prepare("UPDATE giveaways SET entries = ? WHERE id = ?")
                .run(JSON.stringify(entries), id);

            const updated = interaction.client.db
                .prepare("SELECT * FROM giveaways WHERE id = ?")
                .get(id);

            console.log("UPDATING MESSAGE...");

            await interaction.update(
                giveawayManager.buildGiveawayPayload(updated)
            );

            console.log("MESSAGE UPDATED");

            await interaction.followUp({
                content: joined
                    ? `${giveawayManager.CHECK} You **joined** the giveaway.`
                    : `${giveawayManager.CHECK} You **left** the giveaway.`,
                flags: 64
            });

        } catch (err) {
            console.error("GIVEAWAY BUTTON ERROR:", err);

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: `${giveawayManager.XMARK} An error occurred while processing the giveaway.`,
                    flags: 64
                }).catch(() => {});
            }
        }
    }
};