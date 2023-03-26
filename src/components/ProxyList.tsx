import { gql } from '@solid-primitives/graphql';
import { For } from 'solid-js';
import { graphqlClient } from '~/shared/GraphQLClient';

const getProxies = gql`
	query GetProxies {
		proxies {
			id
			name
			proxy_units {
				unit {
					name
					id
				}
			}
		}
	}
`;

interface ProxyListProps {}

export default function ProxyList(props: ProxyListProps) {
	const [proxies] = graphqlClient<{ proxies: { name: string; id: number }[] }>(getProxies);
	return <For each={proxies()?.proxies}>{(proxy) => <p>{proxy.name}</p>}</For>;
}
