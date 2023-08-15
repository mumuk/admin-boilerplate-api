import {ResponseObject, post, requestBody, response} from '@loopback/rest';

/**
 * OpenAPI request for login()
 */
const LOGIN_REQUEST: ResponseObject = {
  description: 'Login Request',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'LoginRequest',
        properties: {
          email: {type: 'string'},
          password: {type: 'string'},
        },
      },
    },
  },
};

/**
 * OpenAPI response for login()
 */
const LOGIN_RESPONSE: ResponseObject = {
  description: 'Login Response. Returns dummy token for any input',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'LoginResponse',
        properties: {
          token: {type: 'string'},
        },
      },
    },
  },
};

export class DummyAuthController {
  constructor() {}

  @post('/login')
  @response(200, LOGIN_RESPONSE)
  login(
    @requestBody(LOGIN_REQUEST) req: {email: string; password: string},
  ): object {
    return {token: 'dummy-token'};
  }
}
