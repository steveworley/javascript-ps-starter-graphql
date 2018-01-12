import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './types.graphql';
import villains from '../data/villains';

const resolvers = {
    Query: {
        villain: (_, args) => villains.find(villain => villain.id === args.id),
        totalVillains: () => villains.length,
        allVillains: () => villains,
    }
}

export default makeExecutableSchema({ typeDefs, resolvers });
