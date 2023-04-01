import { Component, createSignal } from 'solid-js';
import { Games, UnitGroups, Units, getGames, getUnitGroups, getUnits } from '~/components/Sidebar';
import { graphqlClient } from '~/shared/GraphQLClient';

const SubmitProxy: Component<{}> = (props) => {
	const [selectedGameId, setSelectedGameId] = createSignal<number | undefined>(undefined);
	const [selectedUnitGroupId, setSelectedUnitGroupId] = createSignal<number | undefined>(undefined);
	const [selectedUnitIds, setSelectedUnitIds] = createSignal<number[]>([]);

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

	return (
		<div class="container">
			<div class="section">
				<div class="w-4/12">
					<label class="font-bold block" htmlFor="">
						MyMiniFactory url
					</label>
					<span class="text-slate-400 mt-1 block">
						We currently only support links to MyMiniFactory pages
					</span>
					<input placeholder="" class="mt-2 input" type="text" />
				</div>
				<div class="w-4/12 mt-4">
					<Games setSelectedGameId={setSelectedGameId} games={games()}></Games>
					<UnitGroups setSelectedUnitGroupId={setSelectedUnitGroupId} unitGroups={unitGroupsData()} />
					<Units
						setSelectedUnitIds={setSelectedUnitIds}
						units={unitData()}
						selectedUnitsIds={selectedUnitIds()}
					/>
				</div>
			</div>
		</div>
	);
};

export default SubmitProxy;
