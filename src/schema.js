import { bundle } from 'graphql-modules';
import { makeExecutableSchema } from 'graphql-tools';

import heroes from './types/hero';
import villains from './types/villain';
import comics from './types/comic';

const modules = [heroes, villains, comics];

export default makeExecutableSchema(bundle(modules));
