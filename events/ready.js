const giveawayManager = require("../utils/giveawayManager");

module.exports = {

  name: "ready",
  once: true,

  async execute(client) {
    giveawayManager.loadGiveaways(client);
        console.log(`${client.user.tag} is online.`);

    client.user.setActivity("🌿 Powering Stack Dev", {
      type: 3 // WATCHING
    });
  }
};