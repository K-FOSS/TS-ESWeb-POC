// bin/Utils/CircleCI/Artifacts.ts
import 'cross-fetch/dist/node-polyfill';
import { extract, Extract } from 'tar-fs';
import gunzip from 'gunzip-maybe';
import { cpDir } from '../cpDir';

interface Workflow {
  job_name: string;
  job_id: string;
  workflow_name: string;
  workflow_id: string;
}

interface Build {
  build_url: string;
  build_num: number;

  branch: string;
  outcome: string;

  workflows?: Workflow;
}

interface Artifact {
  path: string;

  pretty_path: string;

  node_index: number;

  url: string;
}

function waitOnFinish(stream: Extract): Promise<void> {
  return new Promise((resolve) => {
    stream.on('finish', resolve);
  });
}

export async function getLatestArtifacts(): Promise<string> {
  const projectRequest = await fetch(
    'https://circleci.com/api/v1.1/project/github/facebook/react',
  );
  const projectBuilds = (await projectRequest.json()) as Build[];

  const experimentalBuild = projectBuilds.find(
    ({ workflows, outcome }) =>
      workflows?.job_name === 'process_artifacts_experimental' &&
      outcome === 'success',
  );
  if (!experimentalBuild) throw new Error();

  const buildArtifactRequest = await fetch(
    `https://circleci.com/api/v1.1/project/gh/facebook/react/${experimentalBuild.build_num}/artifacts`,
  );
  const buildArtifacts = (await buildArtifactRequest.json()) as Artifact[];

  const buildArtifact = buildArtifacts.find(({ path }) => path === 'build.tgz');
  if (!buildArtifact) throw new Error('Failed to find Build artificat entry');

  const buildRequest = await fetch(buildArtifact.url);
  if (!buildRequest.body) throw new Error('Failed to download build artifacts');

  const extractStream = extract('tmp');
  const gunzipStream = gunzip();
  gunzipStream.pipe(extractStream);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  await buildRequest.body.pipe(gunzipStream);

  await waitOnFinish(extractStream);

  await cpDir('tmp/build/node_modules', 'node_modules');

  return '';
}
