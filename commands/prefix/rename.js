module.exports = {
  name: "rename",

  async execute(message, args) {
    if (message.author.bot) return;

    const STAFF_ROLE_IDS = "1510895902548692992";

    const isAdmin = message.member.permissions.has("Administrator");
    const hasRole = message.member.roles.cache.has(STAFF_ROLE_IDS);

    if (!isAdmin && !hasRole) {
      return message.reply({
        content: "<:xMark:1503593360995254383> You do not have permission to run this command.",
        allowedMentions: { repliedUser: false }
      });
    }

    if (!message.channel.topic) {
      return message.reply({
        content: "<:xMark:1503593360995254383> This channel is not a ticket channel.",
        allowedMentions: { repliedUser: false }
      });
    }

    if (!/^\d+(\|\d+)?$/.test(message.channel.topic)) {
      return message.reply({
        content: "<:xMark:1503593360995254383> You can only rename ticket channels.",
        allowedMentions: { repliedUser: false }
      });
    }

    const newName = args.slice(0).join(" ");

    if (!newName) {
      return message.reply({
        content: "<:xMark:1503593360995254383> Failed to detect a valid new ticket name.",
        allowedMentions: { repliedUser: false }
      });
    }

    try {
      await message.channel.setName(newName);

      await message.reply("<:check:1503593424299753555> Ticket renamed to **" + newName + "**.");
    } catch (err) {
      console.error(err);

      return message.reply({
        content: "<:xMark:1503593360995254383> An eror occurred.",
        allowedMentions: { repliedUser: false }
      });
    }
  }
};