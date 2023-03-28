import { FaSolidCheck } from 'solid-icons/fa';

interface ChipProps {
	value: any;
	onChange: (value: any) => any;
	name: string;
	selected: boolean;
}

export default function Chip(props: ChipProps) {
	return (
		<button
			onClick={() => props.onChange(props.value)}
			class={`${
				props.selected ? 'bg-pink-600' : 'bg-slate-500'
			} inline-flex items-center h-8  px-3 text-xs mr-4 mb-2 rounded gap-2`}
		>
			{props.name} {props.selected && <FaSolidCheck />}
		</button>
	);
}
