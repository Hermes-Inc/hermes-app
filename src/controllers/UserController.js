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
    try {
      let response = await this.http.post(this.url, {email, password});
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  logout = () => null;
}

export default new UserController();
