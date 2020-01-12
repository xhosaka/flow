import { handleResponse, createStringParams } from './utils';

class APIService {
  constructor() {
    this.host = 'http://localhost:8000'; //TODO import from config!!
  }

  getPlaylist = async uri => {
    const endPoint = `${this.host}/${uri}`;

    try {
      const response = await fetch(endPoint);
      const tracksData = await handleResponse(response);

      return tracksData;
    } catch (error) {
      return error;
    }
  };

  getGenres = async () => {
    const endPoint = `${this.host}/genres`;

    try {
      const response = await fetch(endPoint);
      const genresData = await handleResponse(response);

      return genresData;
    } catch (error) {
      return error;
    }
  };
}

export default new APIService();