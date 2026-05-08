export class LunioAPIError extends Error {
  constructor(message, status, code = null, details = null, body = null) {
    super(message);
    this.name = 'LunioAPIError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.body = body;
  }
}

export class LunioSDKError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LunioSDKError';
  }
}