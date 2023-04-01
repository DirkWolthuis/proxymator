import { A } from '@solidjs/router';
import { createSignal } from 'solid-js';

export default function Header() {
	const [searchActive, setSearchActive] = createSignal(false);

	return (
		<header class="bg-slate-800 border-b border-slate-700 py-4">
			<div class="container">
				<div class="flex justify-between items-center space-x-4 md:space-x-12">
					<A href="/">
						<h1 class="font-mono text-xl">Proxymator</h1>
					</A>

					{/* <div class="grow hidden md:block">
						<input
							placeholder="Look up models by game, army or name"
							class="bg-slate-600 focus:outline focus:outline-2 focus:outline-pink-500 py-2 rounded w-full px-4"
							type="text"
						/>
					</div> */}
					<div class="flex space-x-2">
						{/* <button onClick={() => setSearchActive(true)} class="button button-secondary md:hidden">
							search
						</button> */}
						<A href="/submit-proxy">
							<button class="button button-primary">Submit</button>
						</A>
					</div>
				</div>
			</div>
		</header>
	);
}
