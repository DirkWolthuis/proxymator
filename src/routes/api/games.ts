import { APIEvent, json } from 'solid-start';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache: cache,
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
	uri: import.meta.env.VITE_HASURA_URL,
});

export const getGames = gql`
	query getGames {
		games {
			id
			name
		}
	}
`;

export async function GET({ params, request }: APIEvent) {
	const res = await client
		.query({
			query: getGames,
		})
		.then((res) => res.data);

	return json(res);
}
