import { gql } from '@solid-primitives/graphql';
import { createSignal, For, Setter, Show, Suspense } from 'solid-js';
import Chip from '~/shared/components/Chip';
import { graphqlClient } from '~/shared/GraphQLClient';

const getGames = gql`
	query getGames {
		games {
			id
			name
		}
	}
`;

const getUnitGroups = gql`
	query GetUnitGroups($game_id: Int) {
		unit_groups(where: { game_id: { _eq: $game_id } }) {
			name
			id
		}
	}
`;

const getUnits = gql`
	query GetUnits($unit_group_id: Int) {
		units(where: { unit_group_id: { _eq: $unit_group_id } }) {
			name
			id
		}
	}
`;

export default function Sidebar() {
	const [selectedGameId, setSelectedGameId] = createSignal<number>();
	const [selectedUnitGroupId, setSelectedUnitGroupId] = createSignal<number>();
	const [selectedUnitIds, setSelectedUnitIds] = createSignal<string[]>();

	const [games] = graphqlClient<{ games: { name: string; id: number }[] }>(getGames, {});

	return (
		<aside class="bg-slate-800 rounded-lg p-4">
			<div class="mb-4">
				<label class="font-bold block mb-2" htmlFor="select-game">
					Games
				</label>
				<select
					class="w-full bg-slate-500 h-10 rounded px-4 focus:outline focus:outline-2 focus:outline-pink-500"
					onChange={(event) => setSelectedGameId(parseInt(event.currentTarget.value))}
					name="games"
					id="select-game"
				>
					<option value="">placeholder</option>
					<For each={games()?.games}>{(game) => <option value={game.id}>{game.name}</option>}</For>
				</select>
			</div>

			<Show when={selectedGameId()}>
				<Suspense fallback={<p>loading...</p>}>
					<UnitGroups setSelectedUnitGroupId={setSelectedUnitGroupId} selectedGameId={selectedGameId()} />
				</Suspense>
			</Show>
			<Show when={selectedUnitGroupId()}>
				<Suspense fallback={<p>loading...</p>}>
					<Units selectedUnitGroupId={selectedUnitGroupId()} />
				</Suspense>
			</Show>
		</aside>
	);
}

interface UnitGroupsProps {
	selectedGameId: number | undefined;
	setSelectedUnitGroupId: Setter<number | undefined>;
}

function UnitGroups(props: UnitGroupsProps) {
	const [unitGroups] = graphqlClient<{ unit_groups: { name: string; id: number }[] }>(getUnitGroups, () => ({
		game_id: props.selectedGameId,
	}));
	return (
		<div class="mb-4">
			<label class="font-bold block mb-2" htmlFor="select-game">
				Factions
			</label>
			<select
				class="w-full bg-slate-500 h-10 rounded px-4 focus:outline focus:outline-2 focus:outline-pink-500"
				onChange={(event) => props.setSelectedUnitGroupId(parseInt(event.currentTarget.value))}
				name="unit-groups"
				id="unit-groups"
			>
				<option value="">placeholder</option>
				<For each={unitGroups()?.unit_groups}>
					{(unitGroup) => <option value={unitGroup.id}>{unitGroup.name}</option>}
				</For>
			</select>
		</div>
	);
}

interface UnitsProps {
	selectedUnitGroupId: number | undefined;
	//setSelectedUnitIds: Setter<string | undefined>;
}

function Units(props: UnitsProps) {
	const [units] = graphqlClient<{ units: { name: string; id: number }[] }>(getUnits, () => ({
		unit_group_id: props.selectedUnitGroupId,
	}));
	return (
		<div class="mb-4">
			<label class="font-bold block mb-2" htmlFor="select-game">
				Units
			</label>
			<For each={units()?.units}>{(unit) => <Chip name={unit.name}></Chip>}</For>
		</div>
	);
}
