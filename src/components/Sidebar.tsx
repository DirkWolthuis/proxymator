import { Component, createResource, createSignal, ErrorBoundary, For, Setter, Show, Suspense } from 'solid-js';
import Chip from '~/shared/components/Chip';
import { FaSolidChevronDown, FaSolidChevronUp } from 'solid-icons/fa';
import { useFilter } from '~/context/FilterContext';
import Loader from '~/shared/components/Loader';
import { Game, Unit, UnitGroup } from '~/types';

export const getGames = async (): Promise<{ games: Game[] }> =>
	(
		await fetch(`/api/games`, {
			method: 'GET',
		})
	).json();

export const getUnitGroups = async (gameId: number): Promise<{ unit_groups: UnitGroup[] }> =>
	(
		await fetch(`/api/unit-groups`, {
			method: 'POST',
			body: JSON.stringify({ game_id: gameId }),
		})
	).json();

interface GetUnits extends Unit {
	unit_groups: UnitGroup;
}

export const getUnits = async (unitGroupId: number): Promise<{ units: GetUnits[] }> =>
	(
		await fetch(`/api/units`, {
			method: 'POST',
			body: JSON.stringify({ unit_group_id: unitGroupId }),
		})
	).json();

export const Sidebar: Component = () => {
	const [expanded, setExpanded] = createSignal<boolean>(false);
	const [
		{ selectedGameId, selectedUnitGroupId, selectedUnitIds },
		{ setSelectedGameId, setSelectedUnitGroupId, setSelectedUnitIds },
	] = useFilter();

	const [games] = createResource(getGames);
	const [unitGroups] = createResource(selectedGameId, getUnitGroups);
	const [units] = createResource(selectedUnitGroupId, getUnits);

	const unitGroupsData = () => (selectedGameId() ? unitGroups() : undefined);
	const unitData = () => (selectedUnitGroupId() ? units() : undefined);

	const clearFilters = () => {
		setSelectedGameId(undefined);
		setSelectedUnitGroupId(undefined);
		setSelectedUnitIds([]);
	};

	const onToggleUnitId = (id: number) => {
		if (selectedUnitIds()?.find((suId) => suId === id)) {
			setSelectedUnitIds(selectedUnitIds()?.filter((suId) => suId !== id));
		} else {
			setSelectedUnitIds([...selectedUnitIds(), id]);
		}
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

			<ErrorBoundary fallback={<p>error</p>}>
				<div class={`${expanded() ? 'block' : 'hidden'} lg:block`}>
					<Suspense fallback={<Loader />}>
						<Games setSelectedGameId={setSelectedGameId} games={games()?.games}></Games>
						<UnitGroups
							setSelectedUnitGroupId={setSelectedUnitGroupId}
							unitGroups={unitGroupsData()?.unit_groups}
						/>
						<Units
							setSelectedUnitIds={onToggleUnitId}
							units={unitData()?.units}
							selectedUnitIds={selectedUnitIds()}
						/>
						<div class="mb-4">
							<button onClick={() => clearFilters()} class="button button-secondary">
								Clear filters
							</button>
						</div>
					</Suspense>
				</div>
			</ErrorBoundary>
		</aside>
	);
};
interface GameProps {
	games: Game[] | undefined;
	setSelectedGameId: Setter<number | undefined>;
}
export const Games: Component<GameProps> = (props) => {
	return (
		<div class="mb-4">
			<label class="font-bold block mb-2" htmlFor="select-game">
				Games
			</label>
			<select
				class="select"
				onChange={(event) => props.setSelectedGameId(parseInt(event.currentTarget.value))}
				name="games"
				id="select-game"
			>
				<option value=""></option>
				<For each={props.games}>{(game) => <option value={game.id}>{game.name}</option>}</For>
			</select>
		</div>
	);
};

interface UnitGroupsProps {
	unitGroups: UnitGroup[] | undefined;
	setSelectedUnitGroupId: Setter<number | undefined>;
}

export const UnitGroups: Component<UnitGroupsProps> = (props) => {
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
					<For each={props.unitGroups}>
						{(unitGroup) => <option value={unitGroup.id}>{unitGroup.name}</option>}
					</For>
				</select>
			</Show>
		</div>
	);
};

interface UnitsProps {
	units: Unit[] | undefined;
	selectedUnitIds: number[];
	setSelectedUnitIds: (id: any) => void;
}

export const Units: Component<UnitsProps> = (props) => {
	return (
		<div class="mb-4">
			<label class="font-bold block mb-2" htmlFor="select-game">
				Units
			</label>
			<Show when={!props.units}>
				<p class="text-slate-400">First select a faction</p>
			</Show>
			<Show when={props.units}>
				<For each={props.units}>
					{(unit) => (
						<Chip
							value={unit.id}
							onChange={(id) => props.setSelectedUnitIds(id)}
							selected={!!props.selectedUnitIds?.find((id) => id === unit.id)}
							name={unit.name}
						></Chip>
					)}
				</For>
			</Show>
		</div>
	);
};

export default Sidebar;
