import { Component, Show, createSignal } from 'solid-js';

const Tag: Component<{ title: string; tooltipContent?: string }> = (props) => {
	const [showTooltip, setShowTooltip] = createSignal(false);

	return (
		<div
			onMouseOver={() => setShowTooltip(true)}
			onMouseOut={() => setShowTooltip(false)}
			class="inline-block relative mr-2"
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

			<span class="bg-slate-500 inline-flex items-center h-8 px-3 text-xs mb-2 rounded">{props.title}</span>
		</div>
	);
};

export default Tag;
