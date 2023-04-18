import { ApolloClient, InMemoryCache } from '@apollo/client/core';

export const cache = new InMemoryCache();

export const client = new ApolloClient({
	cache: cache,
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
	uri: import.meta.env.VITE_HASURA_URL,
});
