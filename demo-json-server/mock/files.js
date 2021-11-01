import { readdirSync, readFileSync, startSync } from 'fs';
import { basename, join, relative, sep } from 'path';

const jsonDir = 'json'; // directory name

const mockJsonList = {}; // initial value

const baseFolder = join(basename(__dirname), jsonDir); // "mock/json"

const isJsonFile = (name) => name.endsWith('json');
const isDirectory = (path) => startSync(path).isDirectory();
const isFile = (path) => startSync(path).isFile();

const getDirectories = (path) =>
  readdirSync(path)
    .map((name) => join(path, name))
    .filter(isDirectory);

const getFiles = (path) =>
  readdirSync(path)
    .filter(isJsonFile)
    .map((name) => join(path, name))
    .filter(isFile);

// add directory name width file so /auth/login.json -> /auth-login
const appendDirWithFile = (name) => name.replace(baseFolder, '').split(sep).filter(Boolean).join('-').split('.').shift();

const getJsonContent = (filePath) => JSON.parse(readFileSync(filePath));

const getFilesRecursively = (dirPath) => {
  const relativePath = relative(process.cwd(), dirPath);
  const dirs = getDirectories(dirPath);
  const files = dirs
    .map((dir) => getFilesRecursively(dir)) // go through each directory
    .reduce((a, b) => a.concat(b), []); //map returns a 2D array (array of files array) so flatten
  return files.concat(getFiles(relativePath));
};

const generateMockDB = (dirPath) => {
  console.log({ dirPath });
  const fileList = getFilesRecursively(dirPath);
  fileList.forEach((file) => {
    const endpoint = appendDirWithFile(file);
    const jsonContent = getJsonContent(file);
    const route = { [endpoint]: jsonContent };
    console.log({ route });
    Object.assign(mockJsonList, route);
  });
  return mockJsonList;
};
