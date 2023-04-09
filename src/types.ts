interface GraphQLError {
	errors?: { extensions: { code: string; path: string }; message: string }[];
}
