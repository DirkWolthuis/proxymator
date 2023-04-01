import ProxyList from '~/components/ProxyList';
import Sidebar from '~/components/Sidebar';
import { FilterProvider } from '~/context/FilterContext';

export default function Home() {
	return (
		<FilterProvider>
			<div class="container">
				<div class="section">
					<div class="flex flex-wrap lg:flex-nowrap lg:space-x-16">
						<div class="w-full lg:w-5/12 xl:w-4/12">
							<Sidebar></Sidebar>
						</div>
						<main class="w-full lg:w-auto">
							<ProxyList />
						</main>
					</div>
				</div>
			</div>
		</FilterProvider>
	);
}
