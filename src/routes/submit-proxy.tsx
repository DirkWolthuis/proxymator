import { makeAbortable } from '@solid-primitives/resource';
import {
	Accessor,
	Component,
	For,
	Match,
	Setter,
	Show,
	Suspense,
	Switch,
	createEffect,
	createResource,
	createSignal,
	ErrorBoundary,
} from 'solid-js';
import ProxyItem from '~/components/ProxyItem';
import { Games, UnitGroups, Units, getGames, getUnitGroups, getUnits } from '~/components/Sidebar';
import { ProxyWithUnitsData } from './api/proxy';
import Loader from '~/shared/components/Loader';
import { Proxy, Unit } from '~/types';
import Tag from '~/shared/components/Tag';

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

export const SaveProxyWithUnits = async (
	data: ProxyWithUnitsData,
): Promise<{ insert_proxies: { affected_rows: number } }> =>
	(
		await fetch(`/api/proxy`, {
			method: 'POST',
			body: JSON.stringify({ ...data }),
		})
	).json();

export const GetProxyByUrl = async (url: string): Promise<{ proxies: Proxy[] }> =>
	(
		await fetch(`/api/proxy-by-url`, {
			method: 'POST',
			body: JSON.stringify({ url }),
		})
	).json();

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

const SubmitProxy: Component<{}> = () => {
	const steps = initSteps();
	const [activeStep, setActiveStep] = createSignal(1);
	const [urlWithData, setUrlWithData] = createSignal<UrlData>();
	const [existingProxyId, setExistingProxyId] = createSignal<number>();

	const [selectedUnits, setSelectedUnits] = createSignal<Unit[]>([]);

	const onNextStep = () => {
		setActiveStep(activeStep() + 1);
	};

	const validateStep = (valid: boolean, stepId: number) => {
		steps.find((step) => step.id === stepId)?.setValid(valid);
	};

	return (
		<>
			<Switch>
				<Match when={activeStep() === 1}>
					<UrlStep
						step={steps[0]}
						validateStep={validateStep}
						nextStep={onNextStep}
						saveUrlData={setUrlWithData}
						setSelectedUnits={setSelectedUnits}
						setExistingProxyId={setExistingProxyId}
					/>
				</Match>
				<Match when={activeStep() === 2}>
					<SelectUnitsStep
						validateStep={validateStep}
						step={steps[1]}
						selectedUnits={selectedUnits()}
						setSelectedUnits={setSelectedUnits}
					/>
				</Match>
				<Match when={activeStep() === 3}>
					<SaveStep
						existingProxyId={existingProxyId()}
						urlWithData={urlWithData()}
						selectedUnits={selectedUnits()}
						step={steps[2]}
					></SaveStep>
				</Match>
			</Switch>
			<Show when={steps[activeStep() - 1]?.valid() && (activeStep() === 1 || activeStep() === 2)}>
				<button onClick={onNextStep} class="button button-primary">
					Next
				</button>
			</Show>
		</>
	);
};

export default SubmitProxy;

const UrlStep: Component<{
	step: Step;
	validateStep: (valid: boolean, stepId: number) => void;
	nextStep: () => void;
	saveUrlData: Setter<UrlData>;
	setSelectedUnits: Setter<Unit[]>;
	setExistingProxyId: Setter<number | undefined>;
}> = (props) => {
	const [signal, abort] = makeAbortable({ timeout: 10000 });
	const enrichProxy = async (url: string): Promise<UrlData> =>
		(
			await fetch(`/api/proxy-enrich`, {
				method: 'POST',
				signal: signal(),
				body: JSON.stringify({ url: url }),
			})
		).json();
	const [url, setUrl] = createSignal<string>();
	const validatedUrl = () => (url() && validateUrl(url()!) ? url() : null);
	const [urlWithData] = createResource(validatedUrl, enrichProxy);
	const [proxy] = createResource(validatedUrl, GetProxyByUrl);

	createEffect(() => {
		if (urlWithData()) {
			props.validateStep(true, props.step.id);
			props.saveUrlData(urlWithData()!);
		} else {
			props.validateStep(false, props.step.id);
		}
	});

	createEffect(() => {
		const selectedUnits = proxy()?.proxies?.[0]?.proxy_units?.map((proxyUnit) => ({
			name: proxyUnit.unit.name,
			id: proxyUnit.unit.id,
		}));
		if (selectedUnits?.length > 0) {
			props.setExistingProxyId(proxy()?.proxies[0].id);
			props.setSelectedUnits(selectedUnits);
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
				<Suspense fallback={<Loader />}>
					<Suspense fallback={<Loader />}>
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
									url={''}
									proxy_units={proxy()?.proxies?.[0]?.proxy_units}
								></ProxyItem>
							</div>
						</Show>
					</Suspense>
				</Suspense>
			</div>
		</>
	);
};

const SelectUnitsStep: Component<{
	step: Step;
	validateStep: (valid: boolean, stepId: number) => void;
	setSelectedUnits: Setter<Unit[]>;
	selectedUnits: Unit[];
}> = (props) => {
	const [selectedGameId, setSelectedGameId] = createSignal<number | undefined>(undefined);
	const [selectedUnitGroupId, setSelectedUnitGroupId] = createSignal<number | undefined>(undefined);

	const [games] = createResource(getGames);
	const [unitGroups] = createResource(selectedGameId, getUnitGroups);
	const [units] = createResource(selectedUnitGroupId, getUnits);

	const onToggleUnitId = (id: number) => {
		if (selectedUnitIds()?.find((suId) => suId === id)) {
			props.setSelectedUnits(props.selectedUnits?.filter((unit) => unit.id !== id));
		} else {
			props.setSelectedUnits([...props.selectedUnits, units()?.units.find((unit) => unit.id === id)!]);
		}
	};

	const unitGroupsData = () => (selectedGameId() ? unitGroups() : undefined);
	const unitData = () => (selectedUnitGroupId() ? units() : undefined);
	const selectedUnitIds = () => props.selectedUnits.map((unit) => unit.id);
	createEffect(() => {
		if (props.selectedUnits.length > 0) {
			props.validateStep(true, props.step.id);
		} else {
			props.validateStep(false, props.step.id);
		}
	});

	const onDeselectUnit = (id: number) => {
		props.setSelectedUnits([...props.selectedUnits?.filter((unit) => unit.id !== id)]);
	};
	return (
		<div class="flex flex-wrap lg:flex-nowrap lg:space-x-8">
			<div class="w-full lg:w-1/2">
				<h2 class="text-2xl font-bold">{props.step.title}</h2>
				<div class="mt-4">
					<Suspense fallback={<Loader />}>
						<Games setSelectedGameId={setSelectedGameId} games={games()?.games}></Games>
						<UnitGroups
							setSelectedUnitGroupId={setSelectedUnitGroupId}
							unitGroups={unitGroupsData()?.unit_groups}
						/>
						<div class="max-h-[400px] overflow-y-scroll">
							<Units
								setSelectedUnitIds={onToggleUnitId}
								units={unitData()?.units}
								selectedUnitIds={selectedUnitIds()}
							/>
						</div>
					</Suspense>
				</div>
			</div>
			<div class="w-full lg:w-1/2 mt-8 lg:mt-0">
				<h2 class="text-2xl font-bold">Selected units</h2>
				<div class="mt-4">
					<For each={props.selectedUnits}>
						{(unit) => (
							<Tag
								tooltipContent={`${unit?.unit_group?.game?.name} / ${unit.unit_group?.name}`}
								value={unit.id}
								onClose={(id) => onDeselectUnit(id)}
								closable={true}
								title={unit.name}
							></Tag>
						)}
					</For>
				</div>
			</div>
		</div>
	);
};

const SaveStep: Component<{
	step: Step;
	selectedUnits: {
		name: string;
		id: number;
	}[];
	urlWithData: UrlData | undefined;
	existingProxyId: number | undefined;
}> = (props) => {
	const [result] = createResource(
		() =>
			({
				data: props.selectedUnits.map((unit) => ({ unit_id: unit.id })),
				creator_name: props.urlWithData?.creatorName,
				image_url: props.urlWithData?.imgUrl,
				url: props.urlWithData?.url,
				price: props.urlWithData?.price,
				name: props.urlWithData?.name!,
				proxy_id: props.existingProxyId,
			} as ProxyWithUnitsData),
		SaveProxyWithUnits,
	);

	return (
		<ErrorBoundary fallback={<p>error</p>}>
			<Show when={result.state === 'errored'}>
				<h2>Error</h2>
			</Show>

			<Suspense fallback={<Loader />}>
				<Show when={result.state === 'ready'}>
					<p>Saved!</p>
				</Show>
			</Suspense>
		</ErrorBoundary>
	);
};
