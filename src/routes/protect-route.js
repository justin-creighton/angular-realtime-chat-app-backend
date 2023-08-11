import * as admin from 'firebase-admin';

export const protectRoute = (req, res, next) => {
    try {
        const token = req.headers.authtoken;
        const user = admin.auth().verifyIdToken(token);
        req.user = user;
        next();
    } catch (e) {
        res
            .status(401)
            .json({ message: 'You must be signed in to access these resources!' });
    }
};