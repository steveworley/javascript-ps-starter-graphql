GraphQL Types
---

The GraphQL type system describes what data can be queried and how the values
for those objects are resolved.

## Boilerplate

The boilerplate makes use of `graphql-modules` and `graphql-tools` to allow types to be defined modularly. Each module will define a discrete GrahpQL type and all query/mutation interactions. When the bootstrap file includes a new module it will append the type defined to the **Root** object.

Each module is expected to return an object that is compatible with the `bundle` method from `graphql-modules`.

``` javascript
export default () => {
  schema: /* { GraphQL schema definition } */,
  queries: /* { GraphQL queries definition } */,
  mutations: /* { GraphQL mutation definition } */,
  resolvers: /* { object to define how the Types are resolved } */,
  modules: /* [ an array of dependent types ] */
}
```

*Note: The examples in bundled with the boilerplate use object assignment shorthand to assign the above properties if required.*

## Types

GraphQL expects that the resolver will return data in one of two ways:

  - A JSON object whose properties match the defined type
  - A class with methods/properties that match the defined type

For example we have the following type defined:

``` javascript
const schema = `
  type Todo {
    id: ID!
    title: String!
    completed: Int
  }
`
```

``` javascript
return {
  id: 1,
  title: 'First todo',
  completed: 0
}

/* or */

class Model {
  constructor(data) {
    this.data = data
  }
  id() {
    return this.data.id
  }
  title() {
    return this.data.title
  }
  completed() {
    return !!this.data.completed
  }
}

return new Model(data)

```

## Defining queries

Queries are keyed to the **Root** object and will be used when request data from the GraphQL server. Query definition requires a return type and any arguments that the query will accept.

*Note: Using `!` will instruct the GraphQL server that the argument is required*

For example:

``` javascript
const queries = `
  todo(id: Int!): Todo
  todos: [Todo]
`
```

Let's break this down -

``` javascript
  todo(id: Int!): Todo
```

This adds a `todo` property to the **Root** GraphQL object and instructs the server that it can understand a query for `todo` that needs to have an ID and that the server will deliver the `Todo` type. A query would look like:

``` javascript
{
  todo(id: 1) {
    title
    completed
  }
}
```

The GraphQL server will call the configured **resolver** to find the `todo` with ID 1. Query resolvers are passed the input directly as the second parameter and can return either a direct value or a Promise. An example resolver would look like:

``` javascript
const todo = (_, input) => {
  /* API or database lookup for input.id */
  return new Model()
}
```

*Note: You can use the object destruct pattern to access the known parameter directly.*

## Defining mutations

GraphQL is more focused on providing ways to access defined data sets however it does provide functionality for modifying server-side data through mutations. Similar to REST, GraphQL doesn't explicitly enforce mutation queries to update data it is a good convention to enforce for your application. Like a defined query a mutation will return a typed object that GraphQL can use to return specific fields.

Let's look at a sample mutation definition:

``` javascript
const mutation = `
  createTodo(title: String completed: Boolean): Todo
`
```

Similarly to queries, the mutations should map to a configured resolver that will be called when a mutation request is sent to the server.

``` javascript
const createTodo = (_, { title, completed }) => {
  /* Save to API or local database */
  return new Model(/* Result of the insert */)
}
```

A mutation query sent from a client would look like:

``` javascript
mutation CreateTodo($title: String, $completed: Boolean) {
  createTodo(title: $title, completed: $completed) {
    title
    completed
  }
}
```

## Tying everything up with the Resolver

The resolver defines what functions will be called when the type is queried for. The resolver object should match what is expected by `graphql-tools` and looks like:

``` javascript
const resolvers = {
  queries: {
    /* keyed to match the defined GraphQL queries */
    todo,
    todos: () => { return API.findTodos() }
  },
  mutations: {
    /* keyed to match the defined GraphQL mutations */
    createTodo
  }
  [Type]: {
    /* any fields that require additional look ups for their data */
  }
}
```

## Adding your new type to the application

The `src/schema.js` file manages all GraphQL datasets. After you have created your new GraphQL type you need to import your type into the `schema.js` file and add your type to the list of modules.

``` javascript
import todo from 'types/todo'
const modules = [todo]
```

## Resources

- https://www.apolloGraphQL.com/docs/GraphQL-tools/generate-schema.html#modularizing
- https://www.npmjs.com/package/GraphQL-modules
- http://GraphQL.org/learn/schema/
