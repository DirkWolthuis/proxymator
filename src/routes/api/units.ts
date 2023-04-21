import { APIEvent, json } from 'solid-start';
import { gql } from '@apollo/client/core';
import { client } from '~/shared/services/ApolloService';

export const getUnits = gql`
	query GetUnits($unit_group_id: Int) {
		units(where: { unit_group_id: { _eq: $unit_group_id } }) {
			name
			id
			unit_group {
				name
				game {
					name
				}
			}
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
