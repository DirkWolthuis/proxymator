import { APIEvent, json } from 'solid-start';
import { gql } from '@apollo/client/core';
import { cache, client } from '~/shared/services/ApolloService';

const getProxies = gql`
	query GetProxies {
		proxies(
			order_by: { created_at: desc }
			limit: 25
		) {
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
					unit_group {
						name
						game {
							name
						}
					}
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
			limit: 25
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
					unit_group {
						name
						game {
							name
						}
					}
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
			limit: 25
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
					unit_group {
						name
						game {
							name
						}
					}
				}
			}
		}
	}
`;

const getProxiesByUnitIds = gql`
	query GetProxiesByUnitIds($unit_ids: [Int!]) {
		proxies(where: { proxy_units: { unit_id: { _in: $unit_ids } } }, limit: 25) {
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
