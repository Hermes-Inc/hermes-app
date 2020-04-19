import client from './HttpClient';

class UserController {
  constructor(
    basePath = '/sessions',
    httpClient = client
  ) {
    this.url = basePath;
    this.http = httpClient;
  }

  login = async (email, password) => {
    let response = await this.http.post(this.url, {email, password});
    return response.data;
  };

  logout = () => null;
}

export default new UserController();
