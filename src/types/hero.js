import heroesList from '../../data/heroes'
import villainList from '../../data/villains';
import { api as MarvelApi } from '../poc/MarvelApiController';

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
`;

export const queries = `
  heroes: [Hero]
  hero(id: Int!): Hero
`;

const heroes = () => heroesList;
const hero = (_, { id }) => heroesList.find(hero => hero.id === id);

const resolvers = {
  queries: {
    heroes,
    hero
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

export default () => ({
  schema,
  queries,
  resolvers,
  modules: [villains, comics]
})
