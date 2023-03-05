import { Injector, common, settings, webpack } from "replugged";
import { Channel, Message, User } from "discord-types/general";
const { React } = common;

import badges from "./Badges";
export { Settings } from "./Settings";

const injector = new Injector();

interface Settings {
  staff?: boolean;
  partner?: boolean;
  moderator?: boolean;
  hypesquad?: boolean;
  bughunter?: boolean;
  developer?: boolean;
  earlySupporter?: boolean;
  premium?: boolean;
}
export const cfg = await settings.init<Settings>("dev.kingfish.BadgesEverywhere");

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
