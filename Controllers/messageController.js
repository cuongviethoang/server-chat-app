const messageModel = require("../Models/messageModel");

//createMessage
const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    const message = new messageModel({
        chatId,
        senderId,
        text,
    });

    try {
        const response = await message.save();

        res.status(200).json(response);
    } catch (e) {
        console.log(">> Error create message from server controller: ", e);
        return res.status(500).json(e);
    }
};

// getMessage
const getMessage = async (req, res) => {
    const { chatId } = req.params;

    try {
        const message = await messageModel.find({ chatId });

        if (!message) {
            return res.status(400).json("Not found message");
        }
        return res.status(200).json(message);
    } catch (e) {
        console.log(">> Error get message from server controller: ", e);
        return res.status(500).json(e);
    }
};

module.exports = {
    createMessage,
    getMessage,
};
