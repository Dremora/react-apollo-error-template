import React, { Component, createContext } from 'react';
import { Query, getDataFromTree } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { link } from './graphql/link';

const BlankContext = createContext();

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

const query = gql`
  query ErrorTemplate {
    people {
      id
      name
    }
  }
`;

const People = () => (
  <Query query={query}>
    {({ loading, data }) => (
      <main>
        <header>
          <h1>Apollo Client Error Template</h1>
          <p>
            This is a template that you can use to demonstrate an error in
            Apollo Client. Edit the source code and watch your browser window
            reload with the changes.
          </p>
          <p>
            The code which renders this component lives in{' '}
            <code>./src/App.js</code>.
          </p>
          <p>
            The GraphQL schema is in <code>./src/graphql/schema</code>.
            Currently the schema just serves a list of people with names and
            ids.
          </p>
        </header>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {data.people.map(person => <li key={person.id}>{person.name}</li>)}
          </ul>
        )}
      </main>
    )}
  </Query>
);

class App extends Component {
  state = {
    data: {}
  };

  async componentDidMount() {
    await getDataFromTree(
      <BlankContext.Provider>
        <ApolloProvider client={client}>
          <BlankContext.Consumer>
            (() =>
            <People />
            ))
          </BlankContext.Consumer>
        </ApolloProvider>
      </BlankContext.Provider>
    );
    this.setState({ data: client.cache.extract() });
  }

  render() {
    return JSON.stringify(this.state.data);
  }
}

export default App;
