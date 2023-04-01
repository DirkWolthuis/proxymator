import { Component, For } from 'solid-js';

interface Proxy {
	id: number;
	name?: string;
	url?: string;
	image_url?: string;
	price?: string;
	creator_name?: string;
}

interface ProxyUnit {
	unit: {
		name: string;
		id: number;
	};
}

const ProxyItem: Component<Proxy & { proxy_units: ProxyUnit[] }> = (props) => {
	console.log(props);
	return (
		<div class="flex flex-wrap space-x-0 md:space-x-6 border-b pb-8 mb-8 border-slate-700 md:flex-nowrap">
			<div
				style={`background-image: url("${props?.image_url}")`}
				class="h-[75px] w-full md:h-[200px] md:w-[200px] bg-center bg-no-repeat bg-cover"
			></div>
			<div class="mt-4 md:mt-0">
				<h3 class="font-bold text-base md:text-xl">{props?.name}</h3>
				<h6 class="text-sm md:text-base mt-3">Created by: {props?.creator_name}</h6>
				<div class="space-x-2 mt-6">
					<For each={props.proxy_units}>
						{(proxyUnit) => (
							<span class="bg-slate-500 inline-flex items-center h-8 px-3 text-xs mr-4 mb-2 rounded gap-2">
								{proxyUnit.unit.name}
							</span>
						)}
					</For>
				</div>
			</div>
		</div>
	);
};

export default ProxyItem;
