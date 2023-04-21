import { Component, Show, createSignal } from 'solid-js';
import { FaSolidXmark } from 'solid-icons/fa';
import usePopper from 'solid-popper';

const Tag: Component<{
	title: string;
	value?: any;
	tooltipContent?: string;
	closable?: boolean;
	onClose?: (value: any) => any;
}> = (props) => {
	const [showTooltip, setShowTooltip] = createSignal(false);
	const [anchor, setAnchor] = createSignal<HTMLElement | null>();
	const [popper, setPopper] = createSignal<HTMLElement | null>();

	usePopper(anchor, popper, {
		placement: 'top',
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8],
				},
			},
		],
	});

	return (
		<div
			ref={setAnchor}
			onMouseOver={() => setShowTooltip(true)}
			onMouseOut={() => setShowTooltip(false)}
			class="relative mr-2 gap-2 bg-slate-500 items-center h-8 px-3 text-xs mb-2 rounded inline-flex"
		>
			<Show when={props.tooltipContent}>
				<div
					ref={setPopper}
					class={`${
						showTooltip() ? 'visible' : 'invisible'
					} bg-slate-700 pb-1 py-1 rounded-sm flex justify-center`}
				>
					<span class="italic text-center text-xs ">{props.tooltipContent}</span>
				</div>
			</Show>
			<span>{props.title}</span>
			{props.closable && (
				<button onClick={() => props.onClose?.(props.value)}>
					<FaSolidXmark />
				</button>
			)}
		</div>
	);
};

export default Tag;
