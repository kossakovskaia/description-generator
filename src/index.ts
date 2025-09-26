import "dotenv/config";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateEpic } from "./epic-generator.js";

const argv = yargs(hideBin(process.argv))
  .scriptName("write-epic")
  .usage("$0 <idea> <overview> [options]")
  .positional("idea", { describe: "Short idea", type: "string" })
  .positional("overview", { describe: "High-level overview", type: "string" })
  .option("json", { type: "boolean", default: false, describe: "Also generate JSON and validate" })
  .option("model", { type: "string", default: process.env.OPENAI_MODEL || "gpt-4.1-mini" })
  .option("temperature", { type: "number", default: 0.2 })
  .demandCommand(2)
  .help()
  .parseSync();

async function main() {
    const idea = argv._[0] + "";
    const overview = argv._[1] + "";

    const result = await generateEpic({
        idea,
        overview,
        json: argv.json,
        model: argv.model,
        temperature: argv.temperature,
    });

    if (typeof result === 'string') {
        console.log(result);
    } else if (result) {
        console.log(result.text);
        console.log("\n--- JSON ---\n");
        console.log(JSON.stringify(result.json, null, 2));
    }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

console.log("Hello, product updates generator!");
