// src/graphClient.ts
import { GraphQLClient } from "graphql-request";

const endpoint = "http://127.0.0.1:8000/graphql/";

const graphqlClient = new GraphQLClient(endpoint, {
  requestMiddleware: (request) => {
    // Obtenemos el token de localStorage
    const token = localStorage.getItem("authToken");

    // Añadimos el header 'Authorization' Y 'Content-Type' a todas las peticiones
    return {
      ...request,
      headers: {
        ...request.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json", // <-- AÑADIR ESTA LÍNEA
      },
    };
  },
});

export default graphqlClient;
