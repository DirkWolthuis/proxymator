import { makeAbortable } from '@solid-primitives/resource';
import { Component, Match, Show, Suspense, Switch, createResource, createSignal } from 'solid-js';
import { Games, UnitGroups, Units, getGames, getUnitGroups, getUnits } from '~/components/Sidebar';
import { graphqlClient } from '~/shared/GraphQLClient';

const initSteps = [
	{
		id: 1,
		title: 'Insert url to proxy model',
		valid: false,
		active: true,
	},
	{
		id: 2,
		title: 'Select units that the model proxies',
		valid: false,
		active: false,
	},
	{
		id: 3,
		title: 'Thanks for submitting',
		valid: true,
		active: false,
	},
];

const isValidUrl = (str: string) => {
	// Regular expression for validating URLs
	var pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i',
	); // fragment locator

	// Return true if the input string matches the regular expression pattern
	return pattern.test(str);
};

// List of allowed domains
const allowedDomains = ['www.myminifactory.com', 'myminifactory.com'];

const getHostnameFromUrl = (url: string) => {
	const parsedUrl = new URL(url);
	return parsedUrl.hostname;
};

// Arrow function to check if a URL is from an allowed domain
const isUrlFromAllowedDomain = (url: string) => {
	const domain = getHostnameFromUrl(url);

	return allowedDomains.includes(domain);
};

const doesUrlContainPath = (url: string, path: string) => {
	const parsedUrl = new URL(url);
	const urlPath = parsedUrl.pathname;

	return urlPath.includes(path);
};

const validateUrl = (url: string): boolean => {
	if (!isValidUrl(url) || !isUrlFromAllowedDomain(url)) {
		return false;
	}
	switch (getHostnameFromUrl(url)) {
		case 'www.myminifactory.com':
		case 'myminifactory.com':
			return doesUrlContainPath(url, 'object');
		default:
			return false;
	}
};

const SubmitProxy: Component<{}> = (props) => {
	const [steps, setSteps] = createSignal<typeof initSteps>(initSteps);
	const activeStep = () => steps().find((step) => step.active);

	// const [selectedGameId, setSelectedGameId] = createSignal<number | undefined>(undefined);
	// const [selectedUnitGroupId, setSelectedUnitGroupId] = createSignal<number | undefined>(undefined);
	// const [selectedUnitIds, setSelectedUnitIds] = createSignal<number[]>([]);

	// const [games] = graphqlClient<Games>(getGames, {});
	// const [unitGroups] = graphqlClient<UnitGroups>(getUnitGroups, () =>
	// 	selectedGameId()
	// 		? {
	// 				game_id: selectedGameId(),
	// 		  }
	// 		: null,
	// );
	// const [units] = graphqlClient<Units>(getUnits, () =>
	// 	selectedUnitGroupId()
	// 		? {
	// 				unit_group_id: selectedUnitGroupId(),
	// 		  }
	// 		: null,
	// );

	// const unitGroupsData = () => (selectedGameId() ? unitGroups() : undefined);
	// const unitData = () => (selectedUnitGroupId() ? units() : undefined);

	const onNextStep = () => {
		const activeStep = steps().find((step) => step.active);
		if (activeStep?.valid) {
			setSteps(
				steps().map((step) => {
					if (step.id === activeStep.id + 1) {
						return {
							...step,
							active: true,
						};
					} else {
						return step;
					}
				}),
			);
		}
	};

	return (
		<div class="container">
			<div class="section">
				<Switch>
					<Match when={activeStep()?.id === 1}>
						<UrlStep />
					</Match>
					<Match when={activeStep()?.id === 2}>Step 2</Match>
					<Match when={activeStep()?.id === 3}>Step 3</Match>
				</Switch>
				<Show when={activeStep()?.valid && (activeStep()?.id === 1 || activeStep()?.id === 2)}>
					<button onClick={onNextStep} class="button button-primary">
						Next
					</button>
				</Show>
				{/* <div class="w-4/12 mt-4">
					<label class="font-bold block mb-4" htmlFor="">
						Select the units the model can proxy
					</label>
					<Games setSelectedGameId={setSelectedGameId} games={games()}></Games>
					<UnitGroups setSelectedUnitGroupId={setSelectedUnitGroupId} unitGroups={unitGroupsData()} />
					<Units
						setSelectedUnitIds={setSelectedUnitIds}
						units={unitData()}
						selectedUnitsIds={selectedUnitIds()}
					/>
				</div> */}
			</div>
		</div>
	);
};

export default SubmitProxy;

const UrlStep: Component<{}> = (props) => {
	const [signal, abort] = makeAbortable({ timeout: 10000 });
	const enrichProxy = async (url: string) =>
		(await fetch(`http://localhost:3000/api/proxy-enrich`, { method: 'POST', signal: signal() })).json();
	const [url, setUrl] = createSignal<string>();
	const sanatizedUrl = () => (url() && validateUrl(url()!) ? url() : null);
	const [urlWithData] = createResource(sanatizedUrl, enrichProxy);

	console.log(
		validateUrl('https://www.myminifactory.com/es/object/3d-print-mounted-skeletons-highlands-miniatures-253233'),
	);

	return (
		<>
			<label class="font-bold block" htmlFor="">
				MyMiniFactory url {url()}{' '}
			</label>
			<span class="text-slate-400 mt-1 block">We currently only support links to MyMiniFactory pages</span>
			<input
				value={url() ?? ''}
				onInput={(e) => setUrl(e.currentTarget.value)}
				placeholder=""
				class="mt-2 input"
				type="text"
			/>
			<Suspense>{JSON.stringify(urlWithData())}</Suspense>
		</>
	);
};
