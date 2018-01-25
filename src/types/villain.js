
import villainList from '../../data/villains';

const schema = `
  type Villain {
    id: ID!
    name: String!
    age: Int
    weight: Int
    image: String
    description: String
    powers: String
    first_appearance: String
  }
`;

export const queries = `
  villains: [Villain],
  villain(id: Int!): Villain,
`

const villains = () => villainList;
const villain = (_, { id }) => villainList.find(villain => villain.id === id);

const resolvers = {
  queries: {
    villains,
    villain
  }
}

export default () => ({
  schema,
  queries,
  resolvers,
});
