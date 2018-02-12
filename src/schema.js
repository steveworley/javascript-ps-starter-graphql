import { bundle } from 'graphql-modules';
import { makeExecutableSchema } from 'graphql-tools';

/**
 * --- Import types from the definitions ---
 * Types are defined as submodules in the types directory (see types/README.md)
 * and imported here to be exposed to the GraphQL server.
 */
import heroes from './types/hero';
import villains from './types/villain';
import comics from './types/comic';

// Modules is passed to `bundle` which merges definitions to the root object.
const modules = [heroes, villains, comics];

export default makeExecutableSchema(bundle(modules));
