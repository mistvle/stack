module.exports = {
  name: "guildMemberAdd",

  async execute(client, member) {

    const channel = member.guild.channels.cache.get("1503425522649141398");

    if (channel) {
      channel.send({
  "content": `<:wave:1510914204964491314> Welcome ${member} to **Stack Dev** — your go-to ER:LC development hub. If you're looking to order a top-notch bot for the cheapest price, order today in our [services](https://discord.com/channels/1503106811438436432/1503425345783726192) channel.`,
  "components": [
    {
      "type": 1,
      "components": [
        {
          "style": 2,
          "type": 2,
          "label": `${member.guild.memberCount}`,
          "emoji": {
            "id": "1504308082287575151",
            "name": "m_Heart",
            "animated": false
          },
          "disabled": true,
          "flow": {
            "actions": []
          },
          "custom_id": "p_301237153558433793"
        },
        {
          "type": 2,
          "style": 5,
          "label": "Dashboard",
          "url": "https://discord.com/channels/1503106811438436432/1503424758061203536",
        }
      ]
    }
  ]
});
    }


  }
};