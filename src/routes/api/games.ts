import { APIEvent, json } from 'solid-start';
import { gql } from '@apollo/client/core';
import { client } from '~/shared/services/ApolloService';

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
