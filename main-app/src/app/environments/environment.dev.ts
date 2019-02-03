/*
 The file contents for the current environment will overwrite these during build.
 The build system defaults to the dev environment which uses `environment.ts`, but if you do
 `ng build --env=prod` then `environment.prod.ts` will be used instead.
 The list of which env maps to which file can be found in `.angular-cli.json`.
 http://tattoocoder.com/angular-cli-using-the-environment-option/
 */

export const environment = {
  production: false,
  envName: 'dev',
  ALL_INTENTS: 'http://localhost:8091/api/v1/predefined-intent',
  INIT_BOT: 'http://localhost:8091/api/v1/chatbot/init/',
  ALL_BOTS: 'http://localhost:8091/api/v1/chatbot',
  SAVE_BOT: 'http://localhost:8091/api/v1/chatbot',
  GET_BOT: 'http://localhost:8091/api/v1/chatbot',
  ALL_MESSAGES_URL: 'http://localhost:8091/metadata/messages',
  LOGIN_URL: 'http://localhost:8091/api/v1/auth/generate-token',
  VALIDATION_METADATA_URL: 'http://localhost:8091/metadata/validation',
  INIT_PREDEF_INTENTS: 'http://localhost:8091/api/v1/predefined-intent/init',
  SAVE_PREDEF_INTENT: 'http://localhost:8091/api/v1/predefined-intent',
  GET_PREDEF_INTENT: 'http://localhost:8091/api/v1/predefined-intent',
  UPLOAD_PREDEF_INTENT: 'http://localhost:8091/api/v1/predefined-intent/upload',
  GET_ALL_CMS_CONTENT: 'http://localhost:8091/api/cms/all-content',
  START_LAUNCH_BOT: 'http://localhost:8091/api/v1/chatbot/launch/start',
  LAUNCH_BOT: 'http://localhost:8091/api/v1/chatbot/launch',
  TERMINATE_BOT: 'http://localhost:8091/api/v1/chatbot/terminate',
  STOP_BOT: 'http://localhost:8091/api/v1/chatbot/stop',
  CHANGE_BOT_STATUS: 'http://localhost:8091/api/v1/chatbot/status',
  INIT_TRAIN_MODEL: 'http://localhost:8091/api/v1/model/train/init',
  TRAIN_MODEL: 'http://localhost:8091/api/v1/model/train',
  TRAIN_MODEL_DOWNLOAD: 'http://localhost:8091/api/v1/model/download',
  TRAIN_MODELS: 'http://localhost:8091/api/v1/model'
};