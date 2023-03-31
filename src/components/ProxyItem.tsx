import { Component } from 'solid-js';

const ProxyItem: Component<{ proxyItem: any }> = (props) => {
	return (
		<div>
			<img
				src="https://cdn2.myminifactory.com/assets/object-assets/635ff4a71380c/images/720X720-skeleton-warrior-unit-1.jpg"
				alt=""
			/>
			<p>proxyItem.name</p>
		</div>
	);
};

export default ProxyItem;
