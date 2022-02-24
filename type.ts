export interface Folder {
	foldName: string;
	files: Record<string, string>;
	child?: Folder;
}
