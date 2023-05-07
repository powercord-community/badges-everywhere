
import { components, webpack } from "replugged";
import { User } from "discord-types/general";
import { SettingsType, badge, cfg, profile } from ".";

const { profileBadge24 } = webpack.getByProps("profileBadge24") as Record<string, string>;
const { anchor, anchorUnderlineOnHover } = webpack.getByProps(
  "anchor",
  "anchorUnderlineOnHover",
) as Record<string, string>;

/* eslint-disable camelcase */
const BadgeSettingMapping: Record<string, keyof SettingsType> = {
  staff: "staff",
  partner: "partner",
  hypesquad_house: "hypesquad",
  bug_hunter: "bughunter",
  early_supporter: "earlySupporter",
  active_developer: "developer",
  verified_developer: "developer",
  certified_moderator: "moderator",
  premium: "premium",
  guild_booster_lvl: "premium",
  bot_commands: "bot",
};
/* eslint-enable camelcase */

export function badge(badge: badge): JSX.Element {
  if (badge.link) {
    return (
      <components.Tooltip text={badge.description}>
        <a
          rel="noreferrer noopener"
          target="_blank"
          role="button"
          href={badge.link}
          className={`${anchor} ${anchorUnderlineOnHover}`}>
          <img alt="" src={badge.src} className={profileBadge24} />
        </a>
      </components.Tooltip>
    );
  } else {
    return (
      <components.Tooltip text={badge.description}>
        <span role="button" tabIndex={0}>
          <img alt="" src={badge.src} className={profileBadge24} />
        </span>
      </components.Tooltip>
    );
  }
}

export const cache: Record<string, User> = {};

export default function Badges(getImageUrl: (id: string) => string) {
  return (props: { user: profile }): JSX.Element | null => {
    let { user } = props;

    if (user && user.badges) {
      user.badges = user.badges
        .map((badge) => {
          badge.src = getImageUrl(badge.icon);

          for (const key in BadgeSettingMapping) {
            if (badge.id.startsWith(key)) {
              if (!cfg.get(BadgeSettingMapping[key], true)) {
                return false;
              }
            }
          }

          return badge;
        })
        .filter(Boolean) as badge[];

      return <div className="badges-everywhere">{user.badges.map((b) => b && badge(b))}</div>;
    } else {
      return null;
    }
  };
}
