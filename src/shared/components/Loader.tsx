import { Component } from 'solid-js';

const Loader: Component = (props) => {
	return (
		<div class="w-full flex justify-center">
			<div class="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};

export default Loader;
