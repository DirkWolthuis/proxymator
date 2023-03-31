import { gql } from '@solid-primitives/graphql';
import { Component, createEffect, createSignal, ErrorBoundary, For, Setter, Show, Suspense } from 'solid-js';
import Chip from '~/shared/components/Chip';
import { graphqlClient } from '~/shared/GraphQLClient';
import { FaSolidChevronDown, FaSolidChevronUp } from 'solid-icons/fa';
import { useFilter } from '~/context/FilterContext';

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

type Games = { games: { name: string; id: number }[] };
type UnitGroups = { unit_groups: { name: string; id: number }[] };
type Units = { units: { name: string; id: number }[] };

export const Sidebar: Component = () => {
	const [expanded, setExpanded] = createSignal<boolean>(false);
	const [
		{ selectedGameId, selectedUnitGroupId, selectedUnitIds },
		{ setSelectedGameId, setSelectedUnitGroupId, setSelectedUnitIds },
	] = useFilter();

	const [games] = graphqlClient<Games>(getGames, {});
	const [unitGroups] = graphqlClient<UnitGroups>(getUnitGroups, () =>
		selectedGameId()
			? {
					game_id: selectedGameId(),
			  }
			: null,
	);
	const [units] = graphqlClient<Units>(getUnits, () =>
		selectedUnitGroupId()
			? {
					unit_group_id: selectedUnitGroupId(),
			  }
			: null,
	);

	const unitGroupsData = () => (selectedGameId() ? unitGroups() : undefined);
	const unitData = () => (selectedUnitGroupId() ? units() : undefined);

	const clearFilters = () => {
		setSelectedGameId(undefined);
		setSelectedUnitGroupId(undefined);
		setSelectedUnitIds([]);
	};

	return (
		<aside class="bg-slate-800 rounded-lg p-4 mb-8">
			<div class={`flex justify-between items-center ${expanded() && 'mb-4'} lg:mb-4`}>
				<h3 class="font-bold text-xl ">Filters</h3>
				<button onClick={() => setExpanded(!expanded())} class="lg:hidden">
					<Show when={expanded()}>
						<FaSolidChevronDown></FaSolidChevronDown>
					</Show>
					<Show when={!expanded()}>
						<FaSolidChevronUp></FaSolidChevronUp>
					</Show>
				</button>
			</div>

			<Suspense fallback={<p>loading...</p>}>
				<ErrorBoundary fallback={<p>error</p>}>
					<div class={`${expanded() ? 'block' : 'hidden'} lg:block`}>
						<div class="mb-4">
							<label class="font-bold block mb-2" htmlFor="select-game">
								Games
							</label>
							<select
								value={selectedGameId() ?? 'placeholder'}
								class="select"
								onChange={(event) => setSelectedGameId(parseInt(event.currentTarget.value))}
								name="games"
								id="select-game"
							>
								<option value="placeholder">placeholder</option>
								<For each={games()?.games}>
									{(game) => <option value={game.id}>{game.name}</option>}
								</For>
							</select>
						</div>
						<UnitGroups setSelectedUnitGroupId={setSelectedUnitGroupId} unitGroups={unitGroupsData()} />
						<Units
							setSelectedUnitIds={setSelectedUnitIds}
							units={unitData()}
							selectedUnitsIds={selectedUnitIds()}
						/>
						<div class="mb-4">
							<button onClick={() => clearFilters()} class="button button-secondary">
								Clear filters
							</button>
						</div>
					</div>
				</ErrorBoundary>
			</Suspense>
		</aside>
	);
};

interface UnitGroupsProps {
	unitGroups: UnitGroups | undefined;
	setSelectedUnitGroupId: Setter<number | undefined>;
}

const UnitGroups: Component<UnitGroupsProps> = (props) => {
	return (
		<div class="mb-4">
			<label class="font-bold block mb-2" htmlFor="select-game">
				Factions
			</label>
			<Show when={!props.unitGroups}>
				<p class="text-slate-400">First select a game</p>
			</Show>
			<Show when={props.unitGroups}>
				<select
					class="select"
					onChange={(event) => props.setSelectedUnitGroupId(parseInt(event.currentTarget.value))}
					name="unit-groups"
					id="unit-groups"
				>
					<option value="">No filter</option>
					<For each={props.unitGroups?.unit_groups}>
						{(unitGroup) => <option value={unitGroup.id}>{unitGroup.name}</option>}
					</For>
				</select>
			</Show>
		</div>
	);
};

interface UnitsProps {
	units: Units | undefined;
	selectedUnitsIds: number[];
	setSelectedUnitIds: Setter<number[]>;
}

const Units: Component<UnitsProps> = (props) => {
	const onToggleChip = (id: number) => {
		if (props.selectedUnitsIds?.find((suId) => suId === id)) {
			props.setSelectedUnitIds(props.selectedUnitsIds?.filter((suId) => suId !== id));
		} else {
			props.setSelectedUnitIds([...props.selectedUnitsIds, id]);
		}
	};

	return (
		<div class="mb-4">
			<label class="font-bold block mb-2" htmlFor="select-game">
				Units
			</label>
			<Show when={!props.units}>
				<p class="text-slate-400">First select a faction</p>
			</Show>
			<Show when={props.units}>
				<For each={props.units?.units}>
					{(unit) => (
						<Chip
							value={unit.id}
							onChange={(id) => onToggleChip(id)}
							selected={!!props.selectedUnitsIds?.find((id) => id === unit.id)}
							name={unit.name}
						></Chip>
					)}
				</For>
			</Show>
		</div>
	);
};

export default Sidebar;
