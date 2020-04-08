// bin/Utils/processModules.ts
import { promises as fs } from 'fs';
import { resolve as resolvePath } from 'path';

export async function processModule(modulePath: string): Promise<void> {
  const filePath = resolvePath('node_modules', modulePath);

  const file = await fs.readFile(filePath);
  const fileString = file.toString();

  const processedModule = fileString.replace(
    /if\s+\(process\.env\.NODE_ENV \S+\s"production"\)\s{\n\s+\(function\(\)\s{\n(?<coreCode>(.*\n?)*)}\)\(\);\n}/gim,
    (match, coreCode) => `${coreCode}`,
  );

  return fs.writeFile(filePath, processedModule);
}
