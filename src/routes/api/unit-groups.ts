import { APIEvent, json } from 'solid-start';
import { gql } from '@apollo/client/core';
import { client } from '~/shared/services/ApolloService';

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
