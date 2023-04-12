import { APIEvent, json } from 'solid-start';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const cache = new InMemoryCache();

const client = new ApolloClient({
	cache: cache,
	headers: { 'x-hasura-admin-secret': import.meta.env.VITE_HASURA_KEY },
	uri: import.meta.env.VITE_HASURA_URL,
});

const CheckIfProxyUrlIsUnique = gql`
	query CheckIfProxyUrlIsUnique($url: String = "") {
		proxies(where: { url: { _eq: $url } }) {
			id
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
