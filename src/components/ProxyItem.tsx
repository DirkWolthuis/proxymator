import { Component, For, Show, mergeProps } from 'solid-js';
import Tag from '~/shared/components/Tag';
import { Proxy } from '../types';

const ProxyItem: Component<Proxy> = (props) => {
	const propsWithDefaults = mergeProps({ proxy_units: [] }, props);
	return (
		<div class="flex flex-wrap space-x-0 md:space-x-6 border-b pb-8 mb-8 border-slate-700 md:flex-nowrap">
			<Show when={props.url}>
				<a class="h-[200px] w-full md:h-[200px] md:w-[200px] " href={props.url}>
					<div
						style={`background-image: url("${propsWithDefaults?.image_url}")`}
						class="h-full w-full bg-center bg-no-repeat bg-cover"
					></div>
				</a>
			</Show>
			<Show when={!props.url}>
				<div
					style={`background-image: url("${propsWithDefaults?.image_url}")`}
					class="h-[200px] w-full md:h-[200px] md:w-[200px]  bg-center bg-no-repeat bg-cover"
				></div>
			</Show>

			<div class="mt-4 md:mt-0">
				<Show when={props.url}>
					<a class="hover:underline" href={props.url}>
						<h3 class="font-bold text-base md:text-xl">{propsWithDefaults?.name}</h3>
					</a>
				</Show>
				<Show when={!props.url}>
					<h3 class="font-bold text-base md:text-xl">{propsWithDefaults?.name}</h3>
				</Show>

				<h6 class="text-sm italic mt-2">
					By: {propsWithDefaults?.creator_name} - Price: {propsWithDefaults.price}
				</h6>
				<div class="mt-6">
					<For each={propsWithDefaults.proxy_units}>
						{(proxyUnit) => (
							<Tag
								title={proxyUnit.unit.name}
								tooltipContent={`${proxyUnit.unit.unit_group.game.name} / ${proxyUnit.unit.unit_group.name}`}
							></Tag>
						)}
					</For>
				</div>
				{/* <div class="mt-2">
					<a href={props.url}>
						<button class="button button-primary">See details</button>
					</a>
				</div> */}
			</div>
		</div>
	);
};

export default ProxyItem;
