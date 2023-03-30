import { createSignal, createContext, useContext, Component, JSX } from 'solid-js';

export const makeFilterContext = () => {
	const [selectedGameId, setSelectedGameId] = createSignal<number | undefined>(undefined);
	const [selectedUnitGroupId, setSelectedUnitGroupId] = createSignal<number | undefined>(undefined);
	const [selectedUnitIds, setSelectedUnitIds] = createSignal<number[]>([]);
	return [
		{ selectedGameId, selectedUnitGroupId, selectedUnitIds },
		{ setSelectedGameId, setSelectedUnitGroupId, setSelectedUnitIds },
	] as const;
	// `as const` forces tuple type inference
};
type FilterContextType = ReturnType<typeof makeFilterContext>;

export const FilterContext = createContext<FilterContextType>();
export const useFilter = () => useContext(FilterContext)!;

export const FilterProvider: Component<{ children: JSX.Element }> = (props) => {
	return <FilterContext.Provider value={makeFilterContext()}>{props.children}</FilterContext.Provider>;
};
