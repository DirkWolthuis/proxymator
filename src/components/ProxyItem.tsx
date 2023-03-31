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

const ProxyItem: Component<Proxy & { proxy_unit: ProxyUnit }> = (props) => {
	return (
		<div class="flex space-x-6">
			<div
				style={`background-image: url("${props?.image_url}")`}
				class="h-[250px] w-[250px] bg-center bg-no-repeat bg-cover"
			></div>
			<div>
				<h3 class="font-bold text-xl">{props?.name}</h3>
				<h6 class="mt-3">Created by: {props?.creator_name}</h6>
			</div>
			<div class="space-x-2">{/* <For each={}>{}</For> */}</div>
		</div>
	);
};

export default ProxyItem;
