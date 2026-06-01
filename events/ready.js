module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);

    client.user.setActivity("🌿 Powering Stack Dev", {
      type: 3 // WATCHING
    });
  }
};