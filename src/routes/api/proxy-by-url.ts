import { gql } from '@apollo/client/core';
import { APIEvent, json } from 'solid-start';
import { client } from '~/shared/services/ApolloService';

const CheckIfProxyUrlIsUnique = gql`
	query CheckIfProxyUrlIsUnique($url: String!) {
		proxies(where: { url: { _eq: $url } }) {
			id
			proxy_units {
				unit {
					id
					name
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

export async function POST({ params, request }: APIEvent) {
	const { url }: { url: string } = await new Response(request.body).json();

	const res = await client
		.query({
			query: CheckIfProxyUrlIsUnique,
			variables: { url },
		})
		.then((res) => res.data);

	return json(res);
}
