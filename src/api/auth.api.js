import { Endpoints } from './endpoints.js';

export class AuthApi {
  constructor(request) {
    this.request = request;
  }

  createToken(credentials) {
    return this.request.post(Endpoints.auth, { data: credentials });
  }
}
