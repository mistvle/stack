const {
    SlashCommandBuilder
} = require("discord.js");

const axios = require("axios");

const ASSET_ID = "82550637712269";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("payment")
        .setDescription("Update the payment T-Shirt price.")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount of Robux to charge.")
                .setRequired(true)
        ),

    async execute(interaction) {

        const isAdmin = interaction.member.permissions.has("Administrator");

        if (!isAdmin) {
            return interaction.reply({
                content: "<:xMark:1503593360995254383> You do not have permission to run this command.",
                flags: 64
            });
        }

        const amount = interaction.options.getInteger("amount");

        await interaction.deferReply({ flags: 64 });

        try {

            const cookie = process.env.ROBLOX_COOKIE;

            if (!cookie) {
                throw new Error("ROBLOX_COOKIE is missing from .env");
            }

            // Get CSRF token
            let csrfToken;

            try {
                await axios.post(
                    "https://auth.roblox.com/v2/logout",
                    {},
                    {
                        headers: {
                            Cookie: `.ROBLOSECURITY=${cookie}`
                        }
                    }
                );
            } catch (err) {
                csrfToken = err.response.headers["x-csrf-token"];
            }

            if (!csrfToken) {
                throw new Error("Failed to obtain X-CSRF-TOKEN.");
            }

            // Attempt release/update
            try {
                await await axios.patch(
    "https://itemconfiguration.roblox.com/v1/collectibles/7792b23c-2d06-46cc-8331-ee0f18a98fe1",
                    {
                        saleStatus: "OnSale",
                        priceConfiguration: {
                            priceInRobux: amount
                        }
                    },
                    {
                        headers: {
    Cookie: `.ROBLOSECURITY=${cookie}`,
    "X-CSRF-TOKEN": csrfToken,
    "Content-Type": "application/json",
    "Origin": "https://create.roblox.com",
    "Referer": "https://create.roblox.com/"
}
                    }
                );
            } catch {

                // Already released → update price
                await axios.post(
    "https://itemconfiguration.roblox.com/v1/collectibles/7792b23c-2d06-46cc-8331-ee0f18a98fe1",
    {
    isFree: false,
    optOutFromRegionalPricing: false,
    priceInRobux: 1,
    priceOffset: amount - 5,
    quantityLimitPerUser: 0,
    resaleRestriction: 2,
    saleStatus: 0,
    saleLocationConfiguration: {
        saleLocationType: 3,
        places: []
    }
},
    {
        headers: {
            Cookie: `.ROBLOSECURITY=${cookie}`,
            "X-CSRF-TOKEN": csrfToken,
            "Content-Type": "application/json"
        }
    }
);
            }

            await interaction.channel.send({
                flags: 32768,
                components: [
                    {
                        type: 17,
                        components: [
                            {
                                type: 10,
                                content: "# <:wallet:1510911931735740457> Payment Update"
                            },
                            {
                                type: 14,
                                spacing: 2
                            },
                            {
                                type: 10,
                                content: `The price of the T-Shirt has been updated to **${amount} ROBUX**. Purchase it using the link below. Remember that no refunds will be offered unless an error occurs on our side.`
                            },
                            {
                                type: 14,
                                divider: false
                            },
                            {
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        style: 5,
                                        label: "Payment",
                                        url: `https://www.roblox.com/catalog/${ASSET_ID}/Payment`
                                    }
                                ]
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
                                            url: "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a226fff&is=6a211e7f&hm=f312bf37169c1bdb7d36b98ca95a93b164ee3fffb7e75d1cdfaee23986ae3cc9&=&format=webp&quality=lossless"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

            await interaction.editReply({
                content: `<:check:1503593362517657600> Payment T-Shirt updated to ${amount} Robux.`
            });

        } catch (error) {
    console.log("========== ROBLOX ERROR ==========");
    console.log("STATUS:", error.response?.status);

    if (error.response?.data) {
        console.log(
            JSON.stringify(error.response.data, null, 2)
        );
    }

    console.log("==================================");

    await interaction.editReply({
        content: `Error ${error.response?.status || "Unknown"}`
    });
}
    }
};