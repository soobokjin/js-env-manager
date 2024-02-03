#!/usr/bin/env node
import { Stage } from "./parser/const";
import { program, Option } from "commander";
import { GlobalOption } from "./parser/opt.dto";
import { ParameterStoreEnvManager } from "./env_managers/parameter_store.env_manager";
import promptSync from "prompt-sync";
import * as fs from "fs";

const prompt = promptSync({ sigint: true });

program
  .name("js-env-manager")
  .description("ENV Managing CLI tool")
  .addOption(
    new Option("-s, --stage <type>", "env stage.").choices(Object.values(Stage))
  )
  .option("-p, --aws-profile <type>", "aws profile", "default")
  .option(
    "-r, --repo <type>",
    "repository name",
    process.cwd().substring(process.cwd().lastIndexOf("/") + 1)
  );

program
  .command("bulk-set")
  .description(
    "bulk set from env file. (remove all values which has been previously set )"
  )
  .requiredOption("-f, --file <type>", "file path")
  .action(async (options, command) => {
    const { stage, awsProfile, repo } = command.optsWithGlobals();
    const globalOpt = new GlobalOption(stage, awsProfile, repo);
    const envManager = new ParameterStoreEnvManager(globalOpt);
    const filePath = options.file;
    const confirm: string = prompt(
      `Overwrite \'${filePath}\' data to \'${globalOpt.getName()}\'. Is it right? (y/n)`
    );
    if (confirm !== "y") {
      return;
    }

    let envVariables: Array<EnvVariable> = [];
    const data = fs
      .readFileSync(filePath, "utf8")
      .split("\n")
      .filter((l) => (l.startsWith("#") || l.length === 0 ? false : true))
      .reduce((obj, line) => {
        const equalIdx = line.indexOf("=");
        obj.push({
          key: line.substring(0, equalIdx).trim(),
          value: line.substring(equalIdx + 1).trim(),
        });
        return obj;
      }, envVariables);
    await envManager.bulkSetEnvVariable(data);
  });

program
  .command("set")
  .description("set key, value pair")
  .action(async (_, command) => {
    const { stage, awsProfile, repo } = command.optsWithGlobals();
    const globalOpt = new GlobalOption(stage, awsProfile, repo);
    const envManager = new ParameterStoreEnvManager(globalOpt);

    const key: string = prompt("key to set: ");
    const val: string = prompt("value to set: ");

    console.log(`Try to set env on ${repo} below`);
    console.log(`- key: ${key}`);
    console.log(`- value: ${val}`);

    const res: string = prompt("Is it right? (y/n): ");
    if (res !== "y") {
      return;
    }

    await envManager.setEnvVariable({ key: key, value: val });
  });

program
  .command("print-all")
  .description("print all envs")
  .action(async (options, command) => {
    const { stage, awsProfile, repo } = command.optsWithGlobals();
    const globalOpt = new GlobalOption(stage, awsProfile, repo);
    const envManager = new ParameterStoreEnvManager(globalOpt);
    const values = await envManager.getEnvVariables();
    values.sort(function (l_v, r_v) {
      if (l_v.key < r_v.key) {
        return -1;
      }
      if (l_v.key > r_v.key) {
        return 1;
      }
      return 0;
    });

    for (let value of values) {
      console.log(`${value.key}=${value.value}`);
    }
  });

program
  .command("delete")
  .description("delete key, value pair")
  .action(async (options, command) => {
    const { stage, awsProfile, repo } = command.optsWithGlobals();
    const globalOpt = new GlobalOption(stage, awsProfile, repo);
    const envManager = new ParameterStoreEnvManager(globalOpt);

    const key: string = prompt("key to set: ");

    console.log(`Try to delete env on ${repo} below`);
    console.log(`- key: ${key}`);

    const res: string = prompt("Is it right? (y/n): ");
    if (res !== "y") {
      return;
    }

    await envManager.deleteByKey(key);
  });

program.parse();
