const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = {
  customId: "help",

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("help_modal")
      .setTitle("Help");

    const helpInput = new TextInputBuilder()
      .setCustomId("help_reason")
      .setLabel("How can we help?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(1000)
      .setPlaceholder("I need help with...");

    const row = new ActionRowBuilder().addComponents(helpInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};