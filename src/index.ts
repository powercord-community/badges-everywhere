import { Injector, common, webpack } from "replugged";
import { Channel, Message, User } from 'discord-types/general';
import "./styles.css";
const { React } = common;

import badges from "./Badges";

const injector = new Injector();

export async function start(): Promise<void> {
  const tooltipMod = await webpack.waitForModule<Record<string, React.FC>>(
    webpack.filters.bySource(/shouldShowTooltip:!1/)
  );
  const Tooltip = tooltipMod && webpack.getFunctionBySource<React.FC>(/shouldShowTooltip:!1/, tooltipMod);
  if (!Tooltip) {
    console.error("Failed to find Tooltip component");
    return;
  }
  const Messages = webpack.getByProps("Messages", "getLanguages")?.Messages as Record<string, unknown>;
  const Badges = badges(Tooltip, Messages);

  const mod = await webpack.waitForModule<{
    Z: (...args: Array<{
        decorations: React.ReactElement[][],
        message: Message,
        author: User,
        channel: Channel
      }>) => unknown;
  }>(webpack.filters.bySource('"BADGES"'));

  injector.after(mod, 'Z', ([ args ], res: React.ReactElement) => {
    const { author } = args.message;
    res?.props?.children[3]?.props?.children?.splice(1, 0, React.createElement(Badges, {user: author}));

    return res;
  })
}

export function stop(): void {
  injector.uninjectAll();
}
