const noblox = require("noblox.js");

const GAMEPASS_ID = 82550637712269;
const CHANNEL_ID = "1510892474971852810";

module.exports = async (client) => {

    await noblox.setCookie(process.env.ROBLOX_COOKIE);

    console.log("✅ Purchase logger started.");

    setInterval(async () => {

        try {

            console.log("🔍 Checking purchases...");

            const channel = client.channels.cache.get("1510892474971852810");
            if (!channel) return;

            const sales = await noblox.getGroupTransactions(
    1089350035,
    "Sale",
    "Desc",
    25
);


            for (const sale of sales.reverse()) {

    const transactionId = sale.purchaseToken;

    const exists = client.db.prepare(`
        SELECT *
        FROM purchase_logs
        WHERE transaction_id = ?
    `).get(transactionId);

    if (exists) continue;

    client.db.prepare(`
        INSERT INTO purchase_logs (
            transaction_id
        )
        VALUES (?)
    `).run(transactionId);

    const amountReceived = sale.currency.amount;

    const userLink =
        `https://www.roblox.com/users/${sale.agent.id}/profile`;

    const gamepassLink =
        `https://www.roblox.com/catalog/${sale.details.id}/${encodeURIComponent(sale.details.name)}`;

    await channel.send({
        flags: 32768,
        components: [
            {
                type: 17,
                components: [
                    {
                        type: 10,
                        content: "# <:wallet:1510911931735740457> Purchase Log"
                    },
                    {
                        type: 14,
                        spacing: 2
                    },
                    {
                        type: 10,
                        content:
`A new purchase has been made. View information regarding it below.

**Username:** [${sale.agent.name}](${userLink})
**Gamepass Name:** [${sale.details.name}](${gamepassLink})
**Amount Received:** ${amountReceived}`
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
                                    url: "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a23c17f&is=6a226fff&hm=b3f6fba7649114e335c42eb44dba97f5a5c3a5b7f5f89163c02810e6c90cad79&=&format=webp&quality=lossless"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    });

    console.log(
        `💰 Logged purchase from ${sale.agent.name}`
    );
}

        } catch (err) {
            console.error(
                "Purchase Logger Error:",
                err
            );
        }

    }, 30000);

};