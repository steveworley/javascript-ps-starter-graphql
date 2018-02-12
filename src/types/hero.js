import heroesList from '../../data/heroes'
import villainList from '../../data/villains';
import { api as MarvelApi } from '../helper/MarvelApi';

// Additional Type definitions that are used by this module.
import villains from './villain';
import comics from './comic';

/**
 * --- Schema definition for the type ---
 *
 * @see http://graphql.org/learn/schema/#type-language
 *
 * This is written using the graphql syntax, the schema definition exists inside
 * the backtick block. This defines fields that can be queried for when using
 * one of the defined graphql query handlers.
 *
 * Example:
 * {
 *    hero(id: 1) {
 *      id
 *      name
 *      comics {
 *         title
 *      }
 *    }
 * }
 *
 * Any fields that reference a complex GraphQL type can define resolvers that
 * assist in presenting this information. When using complex types it extends
 * the querability of fields for the given type.
 */
const schema = `
  type Hero @cacheControl(maxAge: 30) {
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

/**
 * --- GraphQL query defintions ---
 *
 * @see http://graphql.org/learn/queries/
 * We define ways that we can query for the type defined above here. Typically
 * we will define a single resource accoess (hero) and a bundled access (heroes)
 * and we define the reponse type so GraphQL knows what data it sends back.
 *
 * Return types can be wrapped in array identifiers to indicate an array of the
 * types will be returned.
 */
const queries = `
  heroes: [Hero]
  hero(id: Int!): Hero
`;


/**
 * --- GraphQL mutation definitions ---
 *
 * @see http://graphql.org/learn/queries/#mutations
 * Mutations allow the GraphQL server to update the data exposed by the query
 * accessors. Mutations follow similar syntax to queries and allow you to define
 * what input will be sent to the resolver so that you can write the method for
 * updateing the content.
 */
const mutations = `
  updateHero(id: Int! input:HeroName!): Hero
  createHero(input:HeroName!):[Hero]
`

/**
 * --- RESOLVERS ---
 *
 * Resolvers are functions that will be called when a query or mutation is
 * received by the GraphQL server. The function signature is given 2 paramters;
 * the graphql context and the input and needs to return a data object that
 * matches the expected return type (if your query returns an array then the
 * resolver needs to match). There is one exception in that your resolvers can
 * return a promise, if it does - the GraphQL server will resolve these and use
 * the return value when delivering a response.
 *
 * These methods need to be assigned to the resolver object under the correct
 * key for the GraphQL server to have access to them.
 */

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
/** --- **/

const resolvers = {
  queries: {
    // Object shorthand is used to assign our query handlers, in the graphql
    // query definition above we defined `heroes` and `hero`. For graphql to
    // properly resolve these, the queries property needs to contain properties
    // that match- heroes: function() {} and hero: function() {}.
    heroes,
    hero
  },
  mutations: {
    // As with queries defined mutations need to follow the same rules when
    // defining the mutations.
    updateHero,
    createHero
  },

  /*
  When the defined type uses complex return types we can define additional field
  resolvers here. These callbakcs are given the current resource, this then
  allows the resolvers to look up information (either DB or API) and format the
  response in a way that the type definition expects.

  As with query and mutation resolvers these resolvers must return a result that
  is expected by the definition (or a promise that will resolve to the expected
  return type).
  */
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

/**
 * --- graphql-tools expected return values ---
 * The graphql-tools package requires the module to return an object that
 * defines the schema, queries, mutations and resolvers. These will be merged
 * into the GraphQL root object automatically after the module has been imported
 * into schema.js.
 *
 * The modules array ensures that your dependent types are exported to the root
 * object.
 *
 * Expected export:
 * {
 *   schema: {GraphQL string},
 *   queries: {GraphQL string},
 *   mutations: {GraphQL string},
 *   resolves: {object},
 *   modules: [array]
 * }
 */
export default () => ({
  schema,
  queries,
  mutations,
  resolvers,
  modules: [villains, comics]
})
