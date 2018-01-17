## GraphQL Demo Server

#### About 

This is a GraphQL server application to be used with a [sibling React application](https://github.com/acquia-pso/javascript-ps-starter-react) for demo and training purposes. This application has a simple schema for the display of a handful of Marvel Villain characters. After installation, you can view the GraphQL API UI for testing at  <a href="http://localhost:8082/graphiql">http://localhost:8082/graphiql</a>. The endpoint path to target from an external application is `http://localhost:8082/graphql`.

- Express
- GraphQL
- GraphQL Tools
- Apollo Server Express
- Babel transpiling 


#### Installation 

- Install <a href="https://yarnpkg.com/lang/en/docs/install/">yarn</a> or also use `npm` for dependencies.
- Install packages with `yarn install` or `npm install`
- Run the server with `yarn start` or `npm start` and visit `http://localhost:8082`


#### Usage

The GraphQL API UI will provide a method to test queries, which you can then replicate in our secondary application. Here are some quick schema constructs which have been added by default. 

```
# Show all Villains with the following properties
{
  allVillains {
    id
    name
    age
    weight
    image
    description
    powers
    first_appearance
  }
}

```
```
# Filter villains by ID
{
  villain(id: 4) {
    id
    name
  }
}
```

```
# Show count of Villains
{
  totalVillains
}
```

---------------------------
<br />
<img src="https://content.screencast.com/users/BedimStudios/folders/Jing/media/b33ab56b-bbdd-46eb-aada-2bc3c2702361/00002809.png" />






