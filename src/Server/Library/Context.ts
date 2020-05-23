// src/Library/Context.ts

interface Context {
  randomValue: 42;
}

export async function getGQLContext(): Promise<Context> {
  const answerToEverything = 42;

  return {
    randomValue: answerToEverything,
  };
}
