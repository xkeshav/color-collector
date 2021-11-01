import { readdirSync, readFileSync, statSync } from 'fs';
import { basename, join, relative, sep } from 'path';

const jsonDir = 'json'; // directory name

const mockJsonList = {}; // initial value

const baseFolder = join(basename(__dirname), jsonDir); // "mock/json"

const isJsonFile = (name: string) => name.endsWith('json');
const isDirectory = (path: string) => statSync(path).isDirectory();
const isFile = (path: string) => statSync(path).isFile();

const getDirectories = (path: string) =>
	readdirSync(path)
		.map((name) => join(path, name))
		.filter(isDirectory);

const getFiles = (path: string) =>
	readdirSync(path)
		.filter(isJsonFile)
		.map((name) => join(path, name))
		.filter(isFile);

// add directory name width file so /auth/login.json -> /auth-login
const appendDirWithFile = (name: string) => name.replace(baseFolder, '').split(sep).filter(Boolean).join('-').split('.').shift();

const getJsonContent = (filePath: string) => JSON.parse(readFileSync(filePath, 'utf-8'));

const getFilesRecursively = (dirPath: string) => {
	const relativePath = relative(process.cwd(), dirPath);
	const dirs = getDirectories(dirPath);
	const files = dirs
		.map((dir: string) => getFilesRecursively(dir)) // go through each directory
		.reduce((a: string, b: string) => a.concat(b), []); //map returns a 2D array (array of files array) so flatten
	return files.concat(getFiles(relativePath));
};

export const generateMockDB = (dirPath: string) => {
	console.log({ dirPath });
	const fileList = getFilesRecursively(dirPath);
	fileList.forEach((file) => {
		const endpoint = appendDirWithFile(file) as string;
		const jsonContent = getJsonContent(file);
		const route = { [endpoint]: jsonContent };
		console.log({ route });
		Object.assign(mockJsonList, route);
	});
	return mockJsonList;
};
