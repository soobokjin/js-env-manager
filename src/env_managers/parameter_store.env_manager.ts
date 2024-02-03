import { IEnvManager } from "./env_manager.interface";
import { ParameterStore } from "../libs/parameter_store";
import { GlobalOption } from "../parser/opt.dto";

export class ParameterStoreEnvManager implements IEnvManager {
  private globalOpt: GlobalOption;
  private pStore: ParameterStore;

  constructor(globalOpt: GlobalOption) {
    this.globalOpt = globalOpt;
    this.pStore = new ParameterStore(globalOpt.awsProfile);
  }

  async getEnvVariableByKey(key: string): Promise<EnvVariable> {
    const res = await this.pStore.getParameter(this.globalOpt.getName());

    return { key: key, value: res[key] };
  }

  async getEnvVariables(): Promise<Array<EnvVariable>> {
    const res = await this.pStore.getParameter(this.globalOpt.getName());
    let values: Array<EnvVariable> = [];

    Object.keys(res).forEach((key) => {
      values.push({ key: key, value: res[key] });
    });
    return values;
  }
  async bulkSetEnvVariable(envVariables: Array<EnvVariable>) {
    const parameters: { [key: string]: any } = {};
    envVariables.reduce((obj, variable) => {
      obj[variable.key] = variable.value;
      return obj;
    }, parameters);

    await this.pStore.updateParameter(this.globalOpt.getName(), parameters);
  }

  async setEnvVariable(envVariable: EnvVariable) {
    const res = await this.pStore.getParameter(this.globalOpt.getName());

    res[envVariable.key] = envVariable.value;

    await this.pStore.updateParameter(this.globalOpt.getName(), res);
  }

  async deleteByKey(key: string) {
    const res = await this.pStore.getParameter(this.globalOpt.getName());

    delete res[key];

    await this.pStore.updateParameter(this.globalOpt.getName(), res);
  }
}
