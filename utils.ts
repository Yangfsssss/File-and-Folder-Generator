export default function upperCaseTheFirstLetterOfAFileName(fileName: string) {
	return fileName[0].toUpperCase() + fileName.slice(1);
}
