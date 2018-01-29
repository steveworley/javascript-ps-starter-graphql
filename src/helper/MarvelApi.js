import crypto from 'crypto';
import fetch from 'node-fetch';

// Import classes to assist with formatting the API response into a structure
// that represents the GraphQL Schema for the type in the graphql server.
import { Model as Comic } from '../types/comic';

/**
---- ENVIRONMENT VARIABLES ----
dotenv stores configuration variables in a local .env file. This allows us to
store API credentials locally and rely on environment variables in production
to store important credentials.

dotenv will not override environment defined variables with those in the file.

@see https://github.com/motdotla/dotenv
@see https://github.com/motdotla/dotenv/issues/133#issuecomment-321779690
*/

class MarvelApi {

  constructor() {
    const privateKey = process.env.API_PRIVATE_KEY;
    const publicKey = process.env.API_PUBLIC_KEY;

    const ts = Date.now();
    const hash = crypto.createHash('md5').update(`${ts}${privateKey}${publicKey}`).digest('hex');

    this.url = 'http://gateway.marvel.com/v1/public';
    this.params = `ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    this._cache = { characters: [], comics: {}};
  }

  handleErrors(error) {
    console.log(error);
  }

  characters() {
    const url = `${this.url}/characters?${this.params}`;

    return fetch(url)
      .then(res => res.json())
      .then()
      .catch(this.handleErrors);
  }

  comics(id) {
    const url = `${this.url}/characters/${id}/comics?${this.params}`;

    if (this._cache.comics[id]) {
      return this._cache.comics[id];
    }

    return fetch(url)
      .then(res => res.json())
      .then(json => {
        const comics = json.data.results.map(i => new Comic(i));
        this._cache.comics[id] = comics;
        return comics;
      })
      .catch(this.handleErrors);
  }

}

// This is the singleton pattern for NodeJS - this will allow all types to use
// the same instance of MarvelApi.
export let api = new MarvelApi();
