const chatModel = require("../Models/chatModel");
// createChat
// getUserChats
//findChat

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId],
        });

        const response = await newChat.save();

        return res.status(200).json(response);
    } catch (e) {
        console.log(">> Error create chat from server controller: ", e);
        return res.status(500).json(error);
    }
};

const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] },
        });

        if (!chats) {
            return res.status(400).json("Not found user chats");
        }

        return res.status(200).json(chats);
    } catch (e) {
        console.log(">> Error find user chat from server controller: ", e);
        return res.status(500).json(error);
    }
};

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.find({
            members: { $all: [firstId, secondId] },
        });

        if (!chat) {
            return res.status(400).json("Not found chat");
        }

        return res.status(200).json(chat);
    } catch (e) {
        console.log(">> Error find chats from server controller: ", e);
        return res.status(500).json(error);
    }
};

module.exports = {
    createChat,
    findUserChats,
    findChat,
};
