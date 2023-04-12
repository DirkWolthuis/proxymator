import { APIEvent, json } from 'solid-start';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache: cache,
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

const getProxiesByUnitGameId = gql`
	query FilterProxiesByUnitGroupId($game_id: Int!) {
		proxies(
			order_by: { created_at: desc }
			where: { proxy_units: { unit: { unit_group: { game_id: { _eq: $game_id } } } } }
		) {
			name
			id
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

const getProxiesByUnitGroupId = gql`
	query GetProxiesByUnitGroupId($unit_group_id: Int!) {
		proxies(
			order_by: { created_at: desc }
			where: { proxy_units: { unit: { unit_group_id: { _eq: $unit_group_id } } } }
		) {
			name
			id
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

const getProxiesByUnitIds = gql`
	query GetProxiesByUnitIds($unit_ids: [Int!]) {
		proxies(where: { proxy_units: { unit_id: { _in: $unit_ids } } }) {
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
	const body: { game_id: number; unit_group_id: number; unit_ids: number[] } = await new Response(
		request.body,
	).json();

	if (body?.unit_ids?.length > 0) {
		const res = await client
			.query({
				query: getProxiesByUnitIds,
				variables: {
					unit_ids: body?.unit_ids,
				},
			})
			.then((res) => res.data);
		return json(res);
	}
	if (body?.unit_group_id) {
		const res = await client
			.query({
				query: getProxiesByUnitGroupId,
				variables: {
					unit_group_id: body?.unit_group_id,
				},
			})
			.then((res) => res.data);
		return json(res);
	}
	if (body?.game_id) {
		const res = await client
			.query({
				query: getProxiesByUnitGameId,
				variables: {
					game_id: body?.game_id,
				},
			})
			.then((res) => res.data);
		return json(res);
	}
	const res = await client
		.query({
			query: getProxies,
		})
		.then((res) => res.data);

	cache.reset();

	return json(res);
}
