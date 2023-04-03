import { makeAbortable } from '@solid-primitives/resource';
import {
	Accessor,
	Component,
	Match,
	Setter,
	Show,
	Suspense,
	Switch,
	createEffect,
	createResource,
	createSignal,
} from 'solid-js';
import ProxyItem from '~/components/ProxyItem';
import { Games, UnitGroups, Units, getGames, getUnitGroups, getUnits } from '~/components/Sidebar';
import { graphqlClient } from '~/shared/GraphQLClient';

interface Step {
	id: number;
	title: string;
	valid: Accessor<boolean>;
	setValid: Setter<boolean>;
}

interface UrlData {
	name: string;
	price: string;
	imgUrl: string;
	creatorName: string;
	url: string;
}

const steps = [
	{
		id: 1,
		title: 'Step 1: Insert url to proxy model',
		valid: false,
	},
	{
		id: 2,
		title: 'Select units that the model proxies',
		valid: false,
	},
	{
		id: 3,
		title: 'Thanks for submitting',
		valid: true,
	},
];

const initSteps = (): Step[] =>
	steps.map((step) => {
		const [valid, setValid] = createSignal(false);
		return { ...step, valid, setValid };
	});

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
	const steps = initSteps();
	const [activeStep, setActiveStep] = createSignal(1);
	const [urlWithData, setUrlWithData] = createSignal<UrlData>();
	createEffect(() => console.log(urlWithData()));
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
		setActiveStep(activeStep() + 1);
	};

	const validateStep = (valid: boolean, stepId: number) => {
		steps.find((step) => step.id === stepId)?.setValid(valid);
	};

	return (
		<div class="container">
			<div class="section">
				<Switch>
					<Match when={activeStep() === 1}>
						<UrlStep
							step={steps[0]}
							validateStep={validateStep}
							nextStep={onNextStep}
							saveUrlData={setUrlWithData}
						/>
					</Match>
					<Match when={activeStep() === 2}>Step 2</Match>
					<Match when={activeStep() === 3}>Step 3</Match>
				</Switch>
				<Show when={steps[activeStep() - 1]?.valid() && (activeStep() === 1 || activeStep() === 2)}>
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

const UrlStep: Component<{
	step: Step;
	validateStep: (valid: boolean, stepId: number) => void;
	nextStep: () => void;
	saveUrlData: Setter<{
		name: string;
		price: string;
		imgUrl: string;
		creatorName: string;
		url: string;
	}>;
}> = (props) => {
	const [signal, abort] = makeAbortable({ timeout: 10000 });
	const enrichProxy = async (url: string): Promise<UrlData> =>
		(
			await fetch(`http://localhost:3000/api/proxy-enrich`, {
				method: 'POST',
				signal: signal(),
				body: JSON.stringify({ url: url }),
			})
		).json();
	const [url, setUrl] = createSignal<string>();
	const sanatizedUrl = () => (url() && validateUrl(url()!) ? url() : null);
	const [urlWithData] = createResource(sanatizedUrl, enrichProxy);

	createEffect(() => {
		if (urlWithData()) {
			props.validateStep(true, props.step.id);
			props.saveUrlData(urlWithData()!);
		}
	});

	return (
		<>
			<div class="w-full lg:w-1/2">
				<h2 class="text-2xl font-bold">{props.step.title}</h2>
				<label class="mt-4 font-bold block" htmlFor="">
					MyMiniFactory url
				</label>
				<span class="text-slate-400 mt-1 block">We currently only support links to MyMiniFactory pages</span>
				<input
					value={url() ?? ''}
					onInput={(e) => setUrl(e.currentTarget.value)}
					placeholder=""
					class="mt-2 input"
					type="text"
				/>
			</div>
			<div class="w-full lg:w-1/2 mt-8">
				<Suspense>
					<Show when={urlWithData()}>
						<label class="font-bold block" htmlFor="">
							Page preview
						</label>
						<div class="mt-4">
							<ProxyItem
								creator_name={urlWithData()?.creatorName!}
								name={urlWithData()?.name!}
								image_url={urlWithData()?.imgUrl!}
								price={urlWithData()?.price!}
								url={'asd'}
							></ProxyItem>
						</div>
					</Show>
				</Suspense>
			</div>
		</>
	);
};
