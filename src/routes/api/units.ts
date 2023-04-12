import { APIEvent, json } from 'solid-start';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache: cache,
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
	uri: import.meta.env.VITE_HASURA_URL,
});

export const getUnits = gql`
	query GetUnits($unit_group_id: Int) {
		units(where: { unit_group_id: { _eq: $unit_group_id } }) {
			name
			id
		}
	}
`;

export async function POST({ params, request }: APIEvent) {
	const { unit_group_id }: { unit_group_id: number } = await new Response(request.body).json();

	const res = await client
		.query({
			query: getUnits,
			variables: {
				unit_group_id: unit_group_id,
			},
		})
		.then((res) => res.data);

	return json(res);
}
