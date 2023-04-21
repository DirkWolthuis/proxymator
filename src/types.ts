interface GraphQLError {
	errors?: { extensions: { code: string; path: string }; message: string }[];
}

export interface Proxy {
	id?: number;
	name: string;
	url?: string;
	image_url: string;
	price: string;
	creator_name: string;
	proxy_units?: ProxyUnit[];
}

export interface ProxyUnit {
	unit: {
		unit_group: UnitGroup;
	} & Unit;
}

export interface Unit {
	name: string;
	id: number;
	unit_group?: UnitGroup;
}

export interface UnitGroup {
	id: string;
	name: string;
	game?: Game;
}

export interface Game {
	id: string;
	name: string;
}
