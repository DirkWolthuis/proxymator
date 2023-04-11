import { gql } from '@solid-primitives/graphql';
import { createEffect, createResource, ErrorBoundary, For, Match, Suspense, Switch } from 'solid-js';
import { useFilter } from '~/context/FilterContext';
import { graphqlClient } from '~/shared/GraphQLClient';
import ProxyItem, { Proxy } from './ProxyItem';

// const getProxies = gql`
// 	query GetProxies {
// 		proxies(order_by: { created_at: desc }) {
// 			id
// 			name
// 			url
// 			image_url
// 			price
// 			creator_name
// 			proxy_units {
// 				unit {
// 					name
// 					id
// 				}
// 			}
// 		}
// 	}
// `;

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

const getProxies = async (): Promise<{ proxies: Proxy[] }> =>
	(
		await fetch(`${import.meta.env.VITE_BASE_URL}/api/proxies`, {
			method: 'POST',
		})
	).json();

interface ProxyListProps {}

export default function ProxyList(props: ProxyListProps) {
	const [{ selectedGameId, selectedUnitGroupId, selectedUnitIds }] = useFilter();
	const [proxies] = createResource(getProxies);
	//const [proxies] = graphqlClient<{ proxies: Proxy[] }>(getProxies);
	const [proxiesByGameId] = graphqlClient<{ proxies: Proxy[] }>(getProxiesByUnitGameId, () =>
		selectedGameId()
			? {
					game_id: selectedGameId(),
			  }
			: null,
	);
	const [proxiesByUnitGroupId] = graphqlClient<{ proxies: Proxy[] }>(getProxiesByUnitGroupId, () =>
		selectedUnitGroupId()
			? {
					unit_group_id: selectedUnitGroupId(),
			  }
			: null,
	);
	const [proxiesByUnitIds] = graphqlClient<{ proxies: Proxy[] }>(getProxiesByUnitIds, () =>
		selectedUnitIds().length > 0
			? {
					unit_ids: selectedUnitIds(),
			  }
			: null,
	);

	return (
		<Suspense>
			<ErrorBoundary fallback={<p>stuk</p>}>
				<Switch fallback={<p>fallback</p>}>
					<Match when={selectedUnitIds().length > 0}>
						<For each={proxiesByUnitIds()?.proxies}>{(proxy) => <ProxyItem {...proxy}></ProxyItem>}</For>
					</Match>
					<Match when={selectedUnitGroupId()}>
						<For each={proxiesByUnitGroupId()?.proxies}>
							{(proxy) => <ProxyItem {...proxy}></ProxyItem>}
						</For>
					</Match>
					<Match when={selectedGameId()}>
						<For each={proxiesByGameId()?.proxies}>{(proxy) => <ProxyItem {...proxy}></ProxyItem>}</For>
					</Match>
					<Match when={proxies()}>
						<For each={proxies()?.proxies}>{(proxy) => <ProxyItem {...proxy}></ProxyItem>}</For>
					</Match>
				</Switch>
			</ErrorBoundary>
		</Suspense>
	);
}
