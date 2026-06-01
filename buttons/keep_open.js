module.exports = {
    customId: "keep_open",

    async execute(interaction) {

        const updatedComponents = interaction.message.components.map(container => ({

            type: container.type,

            components: container.components.map(component => {

                // button row
                if (component.type === 1) {

                    return {
                        type: 1,
                        components: component.components.map(button => ({
                            type: 2,
                            style: button.style,
                            label: button.label,
                            custom_id: button.customId,
                            disabled:
                                button.customId === "keep_open" ||
                                button.customId === "close_ticket"
                        }))
                    };
                }

                // everything else
                return component.toJSON();
            })
        }));

        await interaction.update({
            components: updatedComponents
        });

        await interaction.followUp({
            content: "<:bell:1503469398676209820> The ticket owner has decided to keep this ticket open."
        });
    }
};