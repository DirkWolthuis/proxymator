import { createResource, ErrorBoundary, For, Match, Suspense, Switch } from 'solid-js';
import { useFilter } from '~/context/FilterContext';
import ProxyItem, { Proxy } from './ProxyItem';
import Loader from '~/shared/components/Loader';

const getProxies = async (filterOptions?: {
	game_id?: number;
	unit_ids?: number[];
	unit_group_id?: number;
}): Promise<{ proxies: Proxy[] }> =>
	(
		await fetch(`/api/proxies`, {
			method: 'POST',
			body: JSON.stringify(filterOptions),
		})
	).json();

interface ProxyListProps {}

export default function ProxyList(props: ProxyListProps) {
	const [{ selectedGameId, selectedUnitGroupId, selectedUnitIds }] = useFilter();
	const [proxies] = createResource({}, getProxies);
	const [proxiesByGameId] = createResource(
		() =>
			selectedGameId()
				? {
						game_id: selectedGameId(),
				  }
				: null,
		getProxies,
	);

	const [proxiesByUnitGroupId] = createResource(
		() =>
			selectedUnitGroupId()
				? {
						unit_group_id: selectedUnitGroupId(),
				  }
				: null,
		getProxies,
	);

	const [proxiesByUnitIds] = createResource(
		() =>
			selectedUnitIds().length > 0
				? {
						unit_ids: selectedUnitIds(),
				  }
				: null,
		getProxies,
	);

	return (
		<Suspense fallback={<Loader />}>
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
