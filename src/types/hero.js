import heroesList from '../../data/heroes'
import villainList from '../../data/villains';
import { api as MarvelApi } from '../helper/MarvelApi';

import villains from './villain';
import comics from './comic';

const schema = `
  type Hero {
    id: ID!
    name: String!
    image: String
    description: String
    villains: [Villain]
    comics: [Comic]
  }

  input HeroName {
    name: String
  }
`;

export const queries = `
  heroes: [Hero]
  hero(id: Int!): Hero
`;

export const mutations = `
  updateHero(id: Int! input:HeroName!): Hero
  createHero(input:HeroName!):[Hero]
`

const heroes = () => heroesList;
const hero = (_, { id }) => heroesList.find(hero => hero.id === id);
const updateHero = (_, { id, input }) => {
  const _hero = hero(_, { id })
  const { name } = input

  if (!_hero) {
    throw new Error(`Couldn't find a hero with an id of ${id}`)
  }

  _hero.name = name
  return _hero
}

const createHero = (_, { input }) => {
  const { name } = input;
  return MarvelApi.characters(name).then(characters => {
    if (characters.length > 0) {
      heroesList.push(characters[0]);
    }
    return heroesList
  })
}

const resolvers = {
  queries: {
    heroes,
    hero
  },
  mutations: {
    updateHero,
    createHero
  },
  Hero: {
    villains: ({ villains }) => {
      const badGuys = [];
      for (let villain of villains) {
        badGuys.push(villainList.find(vil => villain === vil.name));
      }
      return badGuys;
    },
    comics: ({ id }) => MarvelApi.comics(id)
  }
}

/**
 * --- CLASS MODEL ---
 *
 * A model can be used to massage the data received from a remote source (db,
 * api, etc.) into the schema known by GraphQL.
 */
export class Model {
  constructor({ id, name, description, thumbnail }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = `${thumbnail.path}.${thumbnail.extension}`;
    this.villains = [];
    this.comics = [];
  }
}
/** ---- */

export default () => ({
  schema,
  queries,
  mutations,
  resolvers,
  modules: [villains, comics]
})
