import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {loadFilesSync} from '@graphql-tools/load-files';
import {mergeTypeDefs} from '@graphql-tools/merge';
import generateSystem from './shared/lib/generateSystem';

const loadedFiles = loadFilesSync(`${__dirname}/**/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);

const resolvers = {
  Query: {
    starSystems: () => ([
      {type: 'blackhole', name: 'Sagittarius A*'}
    ]),
    starSystem: (_, data) => generateSystem(data.seed)
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
});