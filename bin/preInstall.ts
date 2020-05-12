// bin/postInstall.ts
import { getLatestArtifacts } from './Utils/CircleCI/Artifacts';

await getLatestArtifacts();
