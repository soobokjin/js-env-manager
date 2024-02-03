import { Stage } from "./const";

export class GlobalOption {
  stage: Stage;
  awsProfile: string;
  repositoryName: string;

  constructor(stage: Stage, awsProfile: string, repositoryName: string) {
    if (!stage) {
      throw Error("Set stage option. (-s [local|dev|prod])");
    }
    this.stage = stage;
    this.awsProfile = awsProfile;
    this.repositoryName = repositoryName;
  }

  getName(): string {
    return `${this.stage}-${this.repositoryName}`;
  }
}
