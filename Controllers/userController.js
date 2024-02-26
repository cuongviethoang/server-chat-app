const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { use } = require("../Routes/userRoute");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;

    let token = null;
    try {
        token = jwt.sign({ _id }, jwtkey, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    } catch (e) {
        console.log(e);
    }

    return token;
};

const registerUser = async (req, res) => {
    try {
        console.log(">> check req: ", req.body);
        const { name, email, password } = req.body;

        let user = await userModel.findOne({ email });

        if (user) {
            return res
                .status(400)
                .json("User with the given email already exits...");
        }

        if (!name || !email || !password) {
            return res.status(400).json("All fields are required...");
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json("Email must be a valid email...");
        }

        //kiểm tra mật khẩu đủ mạnh mới cho qua
        // if (!validator.isStrongPassword(password)) {
        //     return res.status(400).json("Password must be a strong password");
        // }

        user = new userModel({ name, email, password });

        // Mã hóa mật khẩu dùng bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);
        res.status(200).json({
            _id: user._id,
            name,
            email,
            token,
        });
    } catch (e) {
        console.log(">> error controller register: ", e);
        return res.status(500).json("Error server");
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email });

        if (!user) return res.status(400).json("Not found user");

        // so sánh mật khẩu nhập vào mật khẩu trong db
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        });
    } catch (e) {
        console.log(">> error controller login: ", e);
        return res.status(500).json("Error server");
    }
};

const findUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await userModel.findById(userId, "_id name email");

        if (!user) {
            return res.status(400).json("Not found user by id");
        }

        return res.status(200).json(user);
    } catch (e) {
        console.log(">> error controller find user: ", e);
        return res.status(500).json("Error server");
    }
};

const getUser = async (req, res) => {
    try {
        const users = await userModel.find({}, "_id name email");

        if (!users) {
            return res.status(400).json("get user error");
        }

        return res.status(200).json(users);
    } catch (e) {
        console.log(">> error controller find user: ", e);
        return res.status(500).json("Error server");
    }
};

module.exports = {
    registerUser,
    loginUser,
    findUser,
    getUser,
};
