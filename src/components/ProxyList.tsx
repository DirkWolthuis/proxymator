import { gql } from '@solid-primitives/graphql';
import { createEffect, ErrorBoundary, For, Match, Suspense, Switch } from 'solid-js';
import { useFilter } from '~/context/FilterContext';
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

const getProxiesByUnitGameId = gql`
	query FilterProxiesByUnitGroupId($game_id: Int!) {
		proxies(where: { proxy_units: { unit: { unit_group: { game_id: { _eq: $game_id } } } } }) {
			name
			id
		}
	}
`;

const getProxiesByUnitGroupId = gql`
	query GetProxiesByUnitGroupId($unit_group_id: Int!) {
		proxies(where: { proxy_units: { unit: { unit_group_id: { _eq: $unit_group_id } } } }) {
			name
			id
		}
	}
`;

const getProxiesByUnitIds = gql`
	query GetProxiesByUnitIds($unit_ids: [Int!]) {
		proxies(where: { proxy_units: { unit_id: { _in: $unit_ids } } }) {
			id
			name
		}
	}
`;

interface ProxyListProps {}

export default function ProxyList(props: ProxyListProps) {
	const [{ selectedGameId, selectedUnitGroupId, selectedUnitIds }] = useFilter();
	const [proxies] = graphqlClient<{ proxies: { name: string; id: number }[] }>(getProxies);
	const [proxiesByGameId] = graphqlClient<{ proxies: { name: string; id: number }[] }>(getProxiesByUnitGameId, () =>
		selectedGameId()
			? {
					game_id: selectedGameId(),
			  }
			: null,
	);
	const [proxiesByUnitGroupId] = graphqlClient<{ proxies: { name: string; id: number }[] }>(
		getProxiesByUnitGroupId,
		() =>
			selectedUnitGroupId()
				? {
						unit_group_id: selectedUnitGroupId(),
				  }
				: null,
	);
	const [proxiesByUnitIds] = graphqlClient<{ proxies: { name: string; id: number }[] }>(getProxiesByUnitIds, () =>
		selectedUnitIds().length < 0
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
						<For each={proxiesByUnitIds()?.proxies}>{(proxy) => <p>{proxy.name}</p>}</For>
					</Match>
					<Match when={selectedUnitGroupId()}>
						<For each={proxiesByUnitGroupId()?.proxies}>{(proxy) => <p>{proxy.name}</p>}</For>
					</Match>
					<Match when={selectedGameId()}>
						<For each={proxiesByGameId()?.proxies}>{(proxy) => <p>{proxy.name}</p>}</For>
					</Match>
					<Match when={proxies()}>
						<For each={proxies()?.proxies}>{(proxy) => <p>{proxy.name}</p>}</For>
					</Match>
				</Switch>
			</ErrorBoundary>
		</Suspense>
	);
}
