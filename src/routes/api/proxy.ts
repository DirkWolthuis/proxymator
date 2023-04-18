import { APIEvent, json } from 'solid-start';
import { gql } from '@apollo/client/core';
import { client } from '~/shared/services/ApolloService';

export interface ProxyWithUnitsData {
	data: { unit_id: number }[];
	creator_name: string;
	image_url: string;
	url: string;
	price: string;
	name: string;
	proxy_id: number;
}

const SaveProxyWithProxyUnits = gql`
	mutation DeleteProxyUnitsAndAddProxyWithUnits(
		$creator_name: String = ""
		$image_url: String = ""
		$name: String = ""
		$price: money = ""
		$url: String = ""
		$data: [proxy_units_insert_input!] = {}
		$proxy_id: Int!
	) {
		delete_proxy_units(where: { proxy_id: { _eq: $proxy_id } }) {
			affected_rows
		}
		insert_proxies(
			objects: {
				creator_name: $creator_name
				image_url: $image_url
				name: $name
				price: $price
				url: $url
				proxy_units: { data: $data }
			}
			on_conflict: { constraint: proxies_url_key, update_columns: url }
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
