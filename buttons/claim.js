module.exports = {
    customId: "claim_ticket",

    async execute(interaction) {

        const channel = interaction.channel;

        const ownerId = (channel.topic || "").split("|")[0];

        // UPDATE TOPIC
        await channel.setTopic(`${ownerId}|${interaction.user.id}`);

        // CLONE COMPONENTS
        const data = JSON.parse(JSON.stringify(interaction.message.components));

        const container = data[0];

        const buttonRow = container.components.find(c => c.type === 1);

        // CHANGE BUTTON
        buttonRow.components[0] = {
            style: 4,
            type: 2,
            label: "Unclaim",
            custom_id: "unclaim_ticket"
        };

        await interaction.update({
            flags: 32768,
            components: data
        });

        await interaction.followUp({
            "flags": 32768,
            "components": [
                {
                    "type": 17,
                    "components": [
                        {
                            "type": 10,
                            "content": `> <:check:1503593424299753555> ${interaction.user} has claimed this ticket. You will be assisted shortly.`
                        }
                    ]
                }
            ]
        });
    }
}