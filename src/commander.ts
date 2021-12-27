import { Command } from 'commander';
const cli = new Command();

export interface InterfaceCLI {
  config?: string;
}

cli
  .version('1.0.0')
  .requiredOption('-c, --config <path>', 'config file')
  .parse(process.argv);

const commander: InterfaceCLI = cli.opts();
export default commander;
