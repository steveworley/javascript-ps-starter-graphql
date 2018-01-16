import express from 'express';
import bodyParser from 'body-parser';
import  { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import schema from './schema';

const cors = require('cors');
const app = express();
const port = 8082;

app.use(cors());
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));
app.get('/', function(req, res) {
  res.send('This is a GraphQL Demo Server ~ !<br><a href="/graphiql">click here</a> to test with the GraphQL API UI.');
});

/*eslint-disable no-console */

app.listen(port, () => console.log(`Server on ${port}`));
