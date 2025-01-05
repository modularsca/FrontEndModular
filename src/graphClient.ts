import { GraphQLClient } from 'graphql-request';

const graphqlClient = new GraphQLClient('http://127.0.0.1:8000/graphql/', {
    headers: {
        // Si necesitas autenticación, agrega aquí el token u otros headers necesarios.
        // Authorization: `Bearer YOUR_TOKEN`,
    },
});

export default graphqlClient;
