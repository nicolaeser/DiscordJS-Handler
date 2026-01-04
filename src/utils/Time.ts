import { TimestampStylesString } from "discord.js";
export const time = (time: number, style?: TimestampStylesString): string => {
  return `<t:${Math.floor(time / 1000)}${style ? `:${style}` : ""}>`;
};
