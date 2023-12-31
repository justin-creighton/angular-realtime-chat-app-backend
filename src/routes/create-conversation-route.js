import { createConversation } from "../db";

export const createConversationRoute = {
    method: 'post',
    path: '/api/conversations',
    handler: async (req, res) => {
        const {name, memberIds} = req.body;
        const {user_id: userId} = await req.user;
        const inserted = await createConversation(name, [...memberIds, userId]);

        res.status(200).json(inserted);
    }
}