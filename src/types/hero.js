
// The data.
import heroesList from '../../data/heroes'
import villainList from '../../data/villains';

import villains from './villain';

const schema = `
  type Hero {
    id: ID!
    name: String!
    image: String
    villains: [Villain]
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
    }
  }
}

export default () => ({
  schema,
  queries,
  resolvers,
  modules: [villains]
})
