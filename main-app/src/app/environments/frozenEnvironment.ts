import { rootEnvironment } from './environment';

const url = rootEnvironment.apiUrl;
const envNameLocal = rootEnvironment.envName;
const productionLocal = rootEnvironment.production;
export const environment = Object.freeze({
  BASE_API_URL: url,
  production: productionLocal,
  envName: envNameLocal,

  ALL_INTENTS: url + '/api/v1/predefined-intent',
  INIT_SEARCH_INTENT:
    url + '/api/v1/predefined-intent/search/init',
  INIT_SEARCH_CUSTOM_INTENT:
    url + '/api/v1/custom-intent/search/init',
  SEARCH_INTENT: url + '/api/v1/predefined-intent/search',
  CUSTOM_SEARCH_INTENT: url + '/api/v1/custom-intent/search',
  INIT_BOT: url + '/api/v1/chatbot/init/',
  ALL_BOTS: url + '/api/v1/chatbot',
  SAVE_BOT: url + '/api/v1/chatbot',
  GET_BOT: url + '/api/v1/chatbot',
  ALL_MESSAGES_URL: url + '/metadata/messages',
  LOGIN_URL: url + '/api/v1/auth/generate-token',
  VALIDATION_METADATA_URL: url + '/metadata/validation',
  INIT_PREDEF_INTENTS: url + '/api/v1/predefined-intent/init',
  SAVE_PREDEF_INTENT: url + '/api/v1/predefined-intent',
  GET_PREDEF_INTENT: url + '/api/v1/predefined-intent',
  UPLOAD_PREDEF_INTENT: url + '/api/v1/predefined-intent/upload',
  INIT_CUSTOM_INTENTS: url + '/api/v1/custom-intent/init',
  SAVE_CUSTOM_INTENT: url + '/api/v1/custom-intent',
  GET_CUSTOM_INTENT: url + '/api/v1/custom-intent',
  COPY_PREDEF_INTENT: url + '/api/v1/custom-intent/copy-standard-intents',
  UPLOAD_CUSTOM_INTENT: url + '/api/v1/custom-intent/upload',
  GET_ALL_CMS_CONTENT: url + '/api/cms/all-content',
  START_LAUNCH_BOT: url + '/api/v1/chatbot/launch/start',
  TEST_BOT: url + '/api/v1/chatbot/test',
  LAUNCH_BOT: url + '/api/v1/chatbot/launch',
  TERMINATE_BOT: url + '/api/v1/chatbot/terminate',
  STOP_BOT: url + '/api/v1/chatbot/stop',
  RESTART_BOT: url + '/api/v1/chatbot/restart',
  CHANGE_BOT_STATUS: url + '/api/v1/chatbot/status',
  INIT_SEARCH_BOT: url + '/api/v1/chatbot/search/init',
  SEARCH_BOT: url + '/api/v1/chatbot/search',
  INIT_TRAIN_MODEL: url + '/api/v1/model/train/init',
  TRAIN_MODEL: url + '/api/v1/model/train',
  RETRAIN_MODEL: url + '/api/v1/model/re-train',
  TRAIN_MODEL_DOWNLOAD: url + '/api/v1/model/download',
  TRAIN_MODELS: url + '/api/v1/model',
  SEND_CHAT_URL: url + '/chatbot/api/chats',
  INIT_ACCT_URL: url + '/api/v1/account/init',
  SIGN_UP_ACCT_URL: url + '/api/v1/account/signup',
  INIT_CATEGORY_URL: url + '/api/v1/category/init',
  SAVE_CATEGORY_URL: url + '/api/v1/category',
  GET_FOR_EDIT_CATEGORY_URL: url + '/api/v1/category/get-for-edit',
  SAVE_ACTION_URL: url + '/api/v1/action',
  SAVE_POLICY_URL: url + '/api/v1/policy',
  SAVE_RESOURCE_URL: url + '/api/v1/resource',
  SAVE_ROLE_URL: url + '/api/v1/role'
});