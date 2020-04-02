// src/findFiles.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath } from 'path';
import { pathToFileURL } from 'url';
const JS_EXTS = ['.js', '.jsx', ''];
async function findFile(cwd, { fileName, extensions }) {
    // Get all files in a directory
    const directoryFiles = await fs.readdir(cwd, { withFileTypes: true });

    // Filter the diretory files to only thoose with passed extenison and `.js` or `.jsx`
    const matchedFiles = directoryFiles.filter((directoryEntry) => {
        const directoryFileName = directoryEntry.name;
        if (directoryEntry.name.includes(fileName)) {
            if (directoryEntry.isDirectory())
                return true;
            for (let extension of [...extensions, ...JS_EXTS]) {
                if (directoryFileName === fileName + extension) {
                    return true;
                }
            }
        }
        return false;
    });
    let matchedFileName;
    if (matchedFiles.length > 1 || matchedFiles.length < 1) {
        return undefined;
    }
    else {
        const matchedEntry = matchedFiles[0];
        if (matchedEntry.isDirectory()) {
            return findFile(resolvePath(cwd, matchedEntry.name), {
                fileName: 'index',
                extensions,
            });
        }
        matchedFileName = matchedEntry.name;
    }
    return resolvePath(cwd, matchedFileName);
}
export async function findFiles(cwd, fileRules) {
    const filePath = await findFile(cwd, fileRules);
    if (!filePath)
        throw new Error('No files found by finder');
    return pathToFileURL(filePath);
}
