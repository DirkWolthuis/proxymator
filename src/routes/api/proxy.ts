import { APIEvent, json } from 'solid-start';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache: cache,
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
	uri: import.meta.env.VITE_HASURA_URL,
});

export interface ProxyWithUnitsData {
	data: { unit_id: number }[];
	creator_name: string;
	image_url: string;
	url: string;
	price: string;
	name: string;
}

const SaveProxyWithProxyUnits = gql`
	mutation SaveProxyWithProxyUnits(
		$creator_name: String = ""
		$image_url: String = ""
		$name: String = ""
		$price: money = ""
		$url: String = ""
		$data: [proxy_units_insert_input!] = {}
	) {
		insert_proxies(
			objects: {
				creator_name: $creator_name
				image_url: $image_url
				name: $name
				price: $price
				url: $url
				proxy_units: { data: $data }
			}
		) {
			affected_rows
		}
	}
`;

export async function POST({ params, request }: APIEvent) {
	const body: ProxyWithUnitsData = await new Response(request.body).json();

	const res = await client
		.mutate({
			mutation: SaveProxyWithProxyUnits,
			variables: { ...body },
		})
		.then((res) => res.data);

	return json(res);
}
