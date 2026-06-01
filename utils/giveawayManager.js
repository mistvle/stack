const CHECK = "<:check:1503593424299753555>";
const XMARK = "<:xMark:1503593360995254383>";

const timers = new Map();

function parseDuration(input) {
    const match = input.toLowerCase().trim().match(/^(\d+)(s|sec|second|seconds|m|min|minute|minutes|h|hr|hour|hours|d|day|days|w|week|weeks)$/);

    if (!match) return null;

    const amount = parseInt(match[1]);
    const unit = match[2];

    if (unit.startsWith("s")) return amount * 1000;
    if (unit.startsWith("m")) return amount * 60 * 1000;
    if (unit.startsWith("h")) return amount * 60 * 60 * 1000;
    if (unit.startsWith("d")) return amount * 24 * 60 * 60 * 1000;
    if (unit.startsWith("w")) return amount * 7 * 24 * 60 * 60 * 1000;

    return null;
}

function generateGiveawayId(db) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    while (true) {
        let id = "";

        for (let i = 0; i < 4; i++) {
            id += chars[Math.floor(Math.random() * chars.length)];
        }

        const exists = db.prepare("SELECT id FROM giveaways WHERE id = ?").get(id);
        if (!exists) return id;
    }
}

function pickWinners(entries, amount) {
    const pool = [...entries];
    const winners = [];

    while (pool.length > 0 && winners.length < amount) {
        const index = Math.floor(Math.random() * pool.length);
        winners.push(pool.splice(index, 1)[0]);
    }

    return winners;
}

function buildGiveawayPayload(giveaway) {
    const entries = JSON.parse(giveaway.entries || "[]");
    const winners = JSON.parse(giveaway.winners || "[]");
    const ended = giveaway.ended === 1;

    const winnerText = ended
        ? winners.length
            ? winners.map(id => `<@${id}>`).join("\n")
            : "No valid entries."
        : giveaway.winner_count;

    return {
        flags: 32768,
        components: [
            {
                type: 17,
                components: [
                    {
                        type: 10,
                        content: `# <:confetti:1511071100363210886> ${giveaway.prize}`
                    },
                    {
                        type: 10,
                        content: `-# @everyone\n-# Giveaway ID: ${giveaway.id}`
                    },
                    {
                        type: 14,
                        spacing: 2
                    },
                    {
                        type: 10,
                        content: `<:clock:1511071152724770867> **Duration:** ${ended ? "Ended" : `<t:${Math.floor(giveaway.end_time / 1000)}:R>`}\n<:person:1511071196823687270> **Entries:** ${entries.length}\n<:m_Heart:1504308082287575151> **Winners:** ${winnerText}\n`
                    },
                    {
                        type: 14,
                        divider: false
                    },
                    {
                        type: 1,
                        components: [
                            {
                                style: 2,
                                type: 2,
                                label: ended ? "Ended" : "Join",
                                emoji: {
                                    id: "1509097608323399760",
                                    name: "tide_gift",
                                    animated: false
                                },
                                disabled: ended,
                                custom_id: `giveaway_join_${giveaway.id}`
                            },
                            {
                                style: 2,
                                type: 2,
                                label: `${entries.length}`,
                                emoji: {
                                    id: "1509265793068699840",
                                    name: "tide_person",
                                    animated: false
                                },
                                disabled: true,
                                custom_id: `giveaway_count_${giveaway.id}`
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
                                    url: "https://media.discordapp.net/attachments/1510896301028409465/1510896476837122180/footer_v2.png?ex=6a1e7b7f&is=6a1d29ff&hm=96dc3d9b81f4097813b006c3055bb9eee59f0926665d2ca4b4a465530f6d6258&=&format=webp&quality=lossless&width=3200&height=162"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

async function updateGiveawayMessage(client, giveaway) {
    const channel = await client.channels.fetch(giveaway.channel_id).catch(() => null);
    if (!channel) return;

    const message = await channel.messages.fetch(giveaway.message_id).catch(() => null);
    if (!message) return;

    await message.edit(buildGiveawayPayload(giveaway)).catch(() => null);
}

async function endGiveaway(client, id) {
    const db = client.db;

    const giveaway = db.prepare("SELECT * FROM giveaways WHERE id = ?").get(id);
    if (!giveaway || giveaway.ended === 1) return null;

    const entries = JSON.parse(giveaway.entries || "[]");
    const winners = pickWinners(entries, giveaway.winner_count);

    db.prepare("UPDATE giveaways SET ended = 1, winners = ? WHERE id = ?").run(JSON.stringify(winners), id);

    const updated = db.prepare("SELECT * FROM giveaways WHERE id = ?").get(id);
    await updateGiveawayMessage(client, updated);

    const channel = await client.channels.fetch(giveaway.channel_id).catch(() => null);

    if (channel) {

        const giveawayMessage = await channel.messages
            .fetch(giveaway.message_id)
            .catch(() => null);

        if (winners.length) {

            const content =
                `<:confetti:1511071100363210886> Congratulations ${winners.map(id => `<@${id}>`).join(", ")} on winning **${giveaway.prize}**!`;

            if (giveawayMessage) {
                await giveawayMessage.reply({ content });
            } else {
                await channel.send({ content });
            }

        } else {

            const content =
                `${XMARK} Giveaway **${giveaway.id}** ended with no valid entries.`;

            if (giveawayMessage) {
                await giveawayMessage.reply({ content });
            } else {
                await channel.send({ content });
            }
        }
    }

    if (timers.has(id)) {
        clearTimeout(timers.get(id));
        timers.delete(id);
    }

    return updated;
}
function scheduleGiveaway(client, giveaway) {
    if (!giveaway || giveaway.ended === 1) return;

    if (timers.has(giveaway.id)) {
        clearTimeout(timers.get(giveaway.id));
        timers.delete(giveaway.id);
    }

    const MAX_TIMEOUT = 2147483647;

    const check = () => {
        const remaining = giveaway.end_time - Date.now();

        if (remaining <= 0) {
            endGiveaway(client, giveaway.id);
            return;
        }

        const timeout = Math.min(remaining, MAX_TIMEOUT);

        const timer = setTimeout(check, timeout);

        timers.set(giveaway.id, timer);
    };

    check();
}

function loadGiveaways(client) {
    const giveaways = client.db.prepare("SELECT * FROM giveaways WHERE ended = 0").all();

    for (const giveaway of giveaways) {
        scheduleGiveaway(client, giveaway);
    }

    console.log(`Loaded ${giveaways.length} active giveaways.`);
}

module.exports = {
    CHECK,
    XMARK,
    parseDuration,
    generateGiveawayId,
    buildGiveawayPayload,
    updateGiveawayMessage,
    endGiveaway,
    scheduleGiveaway,
    loadGiveaways,
    pickWinners
};