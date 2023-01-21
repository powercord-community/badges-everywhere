import { Injector, common, webpack } from "replugged";
import { Channel, Message, User } from "discord-types/general";
const { React } = common;

import badges from "./Badges";

const injector = new Injector();

type premiumProfile = { premiumSince: string; premiumGuildSince: string } & Record<string, string>;

export async function start(): Promise<void> {
  const Messages = webpack.getByProps("Messages", "getLanguages")?.Messages as Record<
    string,
    unknown
  >;
  const Badges = badges(Messages);
  const { getUserProfile } = await webpack.waitForModule<
    Record<string, (id: string) => premiumProfile>
  >(webpack.filters.byProps("getUserProfile"));

  const mod = await webpack.waitForModule<{
    Z: (
      ...args: Array<{
        decorations: React.ReactElement[][];
        message: Message;
        author: User;
        channel: Channel;
      }>
    ) => unknown;
  }>(webpack.filters.bySource('"BADGES"'));

  injector.after(mod, "Z", ([args], res: React.ReactElement) => {
    const { author } = args.message;
    res?.props?.children[3]?.props?.children?.splice(
      1,
      0,
      React.createElement(Badges, { user: author, premium: getUserProfile(author.id) }),
    );

    return res;
  });
}

export function stop(): void {
  injector.uninjectAll();
}
