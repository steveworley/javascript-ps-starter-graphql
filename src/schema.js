import { bundle } from 'graphql-modules';
import { makeExecutableSchema } from 'graphql-tools';

import heroes from './types/hero';
import villains from './types/villain';

const modules = [heroes, villains];

export default makeExecutableSchema(bundle(modules));
