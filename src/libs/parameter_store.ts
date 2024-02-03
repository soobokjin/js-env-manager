import * as AWS from "aws-sdk";

export class ParameterStore {
  RETRY_CNT: number = 3;

  private ssmClient: AWS.SSM;

  constructor(profile: string) {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({
      profile: profile,
    });
    this.ssmClient = new AWS.SSM({ region: "ap-northeast-2" });
  }

  async getParameter(storeName: string, withDecryption: boolean = true) {
    let data;
    try {
      data = await this.ssmClient
        .getParameter({
          Name: storeName,
          WithDecryption: withDecryption,
        })
        .promise();
    } catch (err) {
      console.log(err);
      throw err;
    }

    if (data?.Parameter?.Value) {
      const jsonData = JSON.parse(data.Parameter.Value);
      return jsonData === "" ? {} : jsonData;
    } else {
      throw Error("Value is not exists");
    }
  }
  async updateParameter(
    storeName: string,
    value: any,
    overwrite: boolean = true
  ) {
    try {
      await this.ssmClient
        .putParameter({
          Name: storeName,
          Value: JSON.stringify(value),
          Overwrite: overwrite,
        })
        .promise();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
