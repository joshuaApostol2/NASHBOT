const axios = require('axios');

module.exports = {
    name: "ai4",
    description: "Chat with the AI",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    async execute(api, event, args) {
        const { threadID, messageID } = event;
        const userMessage = args.join(" ");

        if (!userMessage) {
            return api.sendMessage(
                "[ AI CHAT ]\n\n" +
                "❗ Please provide a message to chat with the AI.\n\nExample: aichat Hello!",
                threadID,
                messageID
            );
        }

        api.sendMessage(
            "[ AI CHAT ]\n\n" +
            "⏳ Please wait while I process your request...",
            threadID,
            async (err, info) => {
                if (err) return;

                try {
                    const response = await axios.post('https://free-ai-models.vercel.app/v1/chat/completions', {
                        model: 'gpt-4o-free',
                        messages: [
                            { role: 'system', content: 'You are AI(gpt4-o)' },
                            { role: 'user', content: userMessage }
                        ]
                    });

                    const aiResponse = response.data.response;

                    api.editMessage(
                        "[ AI CHAT ]\n\n" +
                        aiResponse,
                        info.messageID
                    );
                } catch (error) {
                    api.editMessage(
                        "[ AI CHAT ]\n\n" +
                        "❌ Error: Unable to process your request. Please try again later.",
                        info.messageID
                    );
                }
            },
            messageID
        );
    },
};
