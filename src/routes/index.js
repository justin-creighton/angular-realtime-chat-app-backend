import {getUserConversationsRoute} from "./get-user-conversations-route";
import {getAllUsersRoute} from "./get-all-users-route";
import {createConversationRoute} from "./create-conversation-route";

export const routes = [
  getUserConversationsRoute,
  getAllUsersRoute,
  createConversationRoute
];
