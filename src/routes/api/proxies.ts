import { APIEvent, json } from 'solid-start';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const client = new ApolloClient({
	cache: new InMemoryCache(),
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
	uri: import.meta.env.VITE_HASURA_URL,
});

const getProxies = gql`
	query GetProxies {
		proxies(order_by: { created_at: desc }) {
			id
			name
			url
			image_url
			price
			creator_name
			proxy_units {
				unit {
					name
					id
				}
			}
		}
	}
`;

export async function POST({ params, request }: APIEvent) {
	// const { gameId, unitGroupId, unitIds }: { gameId: number; unitGroupId: number; unitIds: number[] } =
	// 	await new Response(request.body).json();

	// if (unitIds?.length > 0) {
	// 	const res = await client.query({
	// 		query: getProxies,
	// 	});
	// 	return json(res);
	// }
	// if (unitGroupId) {
	// }
	// if (gameId) {
	// }
	const res = await client
		.query({
			query: getProxies,
		})
		.then((res) => res.data);

	return json(res);
}
