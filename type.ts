export interface Folder {
	foldName: string;
	files: Record<string, string>;
	child?: Folder;
}

export type FolderConfig = {
	projectName: string;
	fileName: string;
	format: 's' | 'd';
	detailFileName?: string;
};