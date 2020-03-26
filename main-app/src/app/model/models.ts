export class BotConfiguration {
  constructor(private url: string, private port: number, private environment: string) {
  }
}

export interface BotDetail {
  referenceData: {};
  searchResults: any[];
  context: null;
  statusCode: null;
  name: string;
  description: string;
  id: number;
  categoryCode: string;
  successTransactions: any[];
  failureTransactions: any[];
  maybeTransactions: any[];
  percentageSuccess: number;
  percentageFailure: number;
  percentageMaybe: number;
}

export interface Owner {
  firstName: string;
  lastName: string;
}

export interface SeerBotAdminAccount {
  id?: string;
  token: string;
  roles: [{ code: string, name: string, policies: [{ statements: [{}] }] }];
  userName: string;
  firstName: string;
  lastName: string;
  realm: string;
  owner: Owner;
}

export interface UtteranceToIntent {
  intentId: number;
  utterance: string;
  matchedIntent: string;
  transactionId: number;
  ignore?: string;
}

export interface ReTrainBot {
  utteranceToIntents?: UtteranceToIntent[];
  botId?: number;
  categoryId?: number;
  categoryCode?: string;
}
