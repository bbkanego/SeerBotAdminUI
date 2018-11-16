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
  ALL_INTENTS : 'http://localhost:8084/chatnlp/api/intents',
  INIT_BOT: 'http://localhost:8091/api/v1/chatbot/init/',
  ALL_BOTS: 'http://localhost:8091/api/v1/chatbot',
  SAVE_BOT: 'http://localhost:8091/api/v1/chatbot',
  ALL_MESSAGES_URL: 'http://localhost:8091/metadata/messages',
  LOGIN_URL: 'http://localhost:8091/api/v1/auth/generate-token',
  VALIDATION_METADATA_URL: 'http://localhost:8091/metadata/validation'
};
