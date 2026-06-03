module.exports = {
    name: 'verified',

    async execute (message) {
        const isAdmin = message.member.permissions.has("Administrator");
        if (!isAdmin) {
            return;
        }

        await message.delete();
        await message.channel.send("<:check:1503593424299753555> Payment verified. You will receive a notification once your order has been started.")
    }
}