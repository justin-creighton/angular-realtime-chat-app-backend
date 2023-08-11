import {db} from "../db";

export const getUserConversations = async (userId) => {
    const connection = db.getConnection();
    const conversations = await connection.collection('conversations').find({memberIds: userId}).toArray();

    return conversations;
}