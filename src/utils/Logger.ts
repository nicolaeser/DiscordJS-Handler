import chalk from "chalk";
type LogStyle = "info" | "err" | "warn" | "done";
export const log = (string: string, style?: LogStyle): void => {
  const styles = {
    info: { prefix: chalk.blue("[INFO]"), logFunction: console.log },
    err: { prefix: chalk.red("[ERROR]"), logFunction: console.error },
    warn: { prefix: chalk.yellow("[WARNING]"), logFunction: console.warn },
    done: { prefix: chalk.green("[SUCCESS]"), logFunction: console.log },
  };
  const selectedStyle = style ? styles[style] : { prefix: "", logFunction: console.log };
  selectedStyle.logFunction(`${selectedStyle.prefix} ${string}`);
};
