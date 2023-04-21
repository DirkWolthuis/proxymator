import { Component, Show, createSignal } from 'solid-js';
import { FaSolidXmark } from 'solid-icons/fa';
const Tag: Component<{
	title: string;
	value?: any;
	tooltipContent?: string;
	closable?: boolean;
	onClose?: (value: any) => any;
}> = (props) => {
	const [showTooltip, setShowTooltip] = createSignal(false);

	return (
		<div
			onMouseOver={() => setShowTooltip(true)}
			onMouseOut={() => setShowTooltip(false)}
			class="relative mr-2 gap-2 bg-slate-500 items-center h-8 px-3 text-xs mb-2 rounded inline-flex"
		>
			<Show when={props.tooltipContent}>
				<div
					class={`${
						showTooltip() ? 'visible' : 'invisible'
					} absolute bottom-[100%] flex justify-center left-[-50%] right-[-50%] pb-1`}
				>
					<span class="italic text-center bg-slate-700 text-xs px-2 py-1 rounded-sm">
						{props.tooltipContent}
					</span>
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
