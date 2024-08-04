import User from '../../api/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';

export const register = async (req, res, next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
           ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(200).send("User has been created.");
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            console.log('User not found');
            return next(createError(400, "Invalid username or password"));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        console.log('Password comparison result:', isPasswordCorrect); // Debugging line
        if (!isPasswordCorrect) {
            console.log('Password is incorrect');
            return next(createError(400, "Invalid username or password"));
        }

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT, { expiresIn: '1h' });



        const { password, isAdmin, ...otherDetails } = user._doc;
        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200).json({details:{...otherDetails} ,isAdmin });
    } catch (err) {
        next(err);
    }
};
