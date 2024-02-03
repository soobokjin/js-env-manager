export interface IEnvManager {
  getEnvVariableByKey(key: string): Promise<EnvVariable>;

  getEnvVariables(): Promise<Array<EnvVariable>>;

  bulkSetEnvVariable(envVariables: Array<EnvVariable>): void;

  setEnvVariable(envVariable: EnvVariable): void;

  deleteByKey(key: string): void;
}
