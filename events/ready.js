const giveawayManager = require("../utils/giveawayManager");
const purchaseLogger = require("../utils/purchaseLogger");

module.exports = {

  name: "ready",
  once: true,

  async execute(client) {
    giveawayManager.loadGiveaways(client);
        console.log(`${client.user.tag} is online.`);

        await purchaseLogger(client);
        console.log("Purchase logger started.");

    client.user.setActivity("🌿 Powering Stack Dev", {
      type: 3 // WATCHING
    });
  }
};