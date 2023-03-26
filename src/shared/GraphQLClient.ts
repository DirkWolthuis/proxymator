import { createGraphQLClient } from '@solid-primitives/graphql';

export const graphqlClient = createGraphQLClient(import.meta.env.VITE_HASURA_URL, {
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
});
