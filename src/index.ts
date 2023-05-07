import { Injector, common, settings, webpack } from "replugged";
import { Channel, Message, User } from "discord-types/general";
const { React } = common;

import "./style.css";

import badges from "./Badges";
export { Settings } from "./Settings";

const injector = new Injector();

export interface SettingsType {
  staff?: boolean;
  partner?: boolean;
  moderator?: boolean;
  hypesquad?: boolean;
  bughunter?: boolean;
  developer?: boolean;
  earlySupporter?: boolean;
  bot?: boolean;
  premium?: boolean;
  avoidrates?: boolean;
}
export const cfg = await settings.init<SettingsType>("dev.kingfish.BadgesEverywhere");

export interface badge {
  description: string;
  icon: string;
  id: string;
  link: string;
  src?: string;
}
export type profile = {
  premiumSince: string;
  premiumGuildSince: string;
  badges: badge[];
} & Record<string, string>;

export async function start(): Promise<void> {
  const { getUserProfile, isFetchingProfile } = await webpack.waitForModule<
    Record<string, (id: string) => profile>
  >(webpack.filters.byProps("getUserProfile"));

  const getImageUrl: (id: string) => string = webpack.getFunctionBySource<(id: string) => string>(
    await webpack.waitForModule(webpack.filters.bySource("BADGE_ICON(")),
    "BADGE_ICON(",
  ) as (id: string) => string;

  const fetchUser = webpack.getFunctionBySource<(id: string) => unknown>(
    await webpack.waitForModule(webpack.filters.bySource('"USER_PROFILE_FETCH_START"')),
    (source) =>
      source.toString().includes('"USER_PROFILE_FETCH_START"') || source.toString().length < 50,
  );

  const Badges = badges(getImageUrl);

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
    const userProfile: profile = getUserProfile(author.id);
    if (!cfg.get("avoidrates", true) && !userProfile && !isFetchingProfile(author.id)) {
      if (fetchUser) {
        fetchUser(author.id);
      } else {
        return res;
      }
    }
    res?.props?.children[3]?.props?.children?.splice(
      1,
      0,
      React.createElement(Badges, { user: getUserProfile(author.id) }),
    );

    return res;
  });
}

export function stop(): void {
  injector.uninjectAll();
}
