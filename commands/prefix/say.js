module.exports = {
    name: 'say',

    async execute (message, args) {
        const isAdmin = message.member.permissions.has("Administrator");
        if (!isAdmin ) {
            return;
        }
        await message.delete();
        const text = args.split(0).join(" ");
        await message.channel.send(text)
    }
}