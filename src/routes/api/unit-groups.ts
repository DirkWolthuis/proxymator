import { APIEvent, json } from 'solid-start';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache: cache,
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
	uri: import.meta.env.VITE_HASURA_URL,
});

export const getUnitGroups = gql`
	query GetUnitGroups($game_id: Int) {
		unit_groups(where: { game_id: { _eq: $game_id } }) {
			name
			id
		}
	}
`;

export async function POST({ params, request }: APIEvent) {
	const { game_id }: { game_id: number } = await new Response(request.body).json();

	const res = await client
		.query({
			query: getUnitGroups,
			variables: {
				game_id: game_id,
			},
		})
		.then((res) => res.data);

	return json(res);
}
