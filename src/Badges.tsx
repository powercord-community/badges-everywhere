import React from "react";
import { types, webpack } from "replugged";
import { User } from 'discord-types/general';

type TooltipType = React.FC<{
  text: string;
  children: (props: React.HTMLAttributes<HTMLSpanElement>) => JSX.Element;
}>

const BadgeAssets: Record<string, string> = {
  STAFF: '/assets/f62be1ec9bdd82d3d77158ad81830e68.svg',
  PARTNER: '/assets/53828e0c0fb6676440ad11b5d2586241.svg',
  HYPESQUAD: '/assets/f5354673c9cff61c1dcc70081ef774e5.svg',
  HYPESQUAD_ONLINE_HOUSE_1: '/assets/995ecfdbdf94ad84dd4d802c104e4630.svg',
  HYPESQUAD_ONLINE_HOUSE_2: '/assets/473dadec13ab7e90e209cc60fccb31c5.svg',
  HYPESQUAD_ONLINE_HOUSE_3: '/assets/58f11abcf3c13812bff969baaeb84d82.svg',
  BUG_HUNTER_LEVEL_1: '/assets/46f6a28f462889f1a36cfca2591fcade.svg',
  BUG_HUNTER_LEVEL_2: '/assets/5c6bb5c4640972078fc993f1b5f503ce.svg',
  EARLY_VERIFIED_DEVELOPER: '/assets/877dc8bece1590e63fac6d5a0cd2a225.svg',
  ACTIVE_DEVELOPER: '/assets/26c7a60fb1654315e0be26107bd47470.svg',
  EARLY_SUPPORTER: '/assets/d66ce47c4ab7817190af9544f97e98cc.svg',
  CERTIFIED_MODERATOR: '/assets/2af69d4f9d2ff38a7cf76fab0907ea7a.svg',
  PREMIUM: '/assets/e04ce699dcd2fd50d352a384511687a9.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_1: '/assets/1d3c9e1123aee11a325af328609d1274.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_2: '/assets/dd50d32cf4fee241b2fa022d8c0435ae.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_3: '/assets/7294cc730410a1caeceeca736f800b42.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_4: '/assets/496aa1174817ec391612f745dc8e0725.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_5: '/assets/ce54a4f8c0e133a6f2d60336e7acac7d.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_6: '/assets/c0c9db2de008e61a1a720581ca175fa1.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_7: '/assets/556158300f0dca136d3c902586ff1316.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_8: '/assets/ba38c1c57dfccb94127e53b7ac502a90.svg',
  PREMIUM_GUILD_SUBSCRIPTION_LEVEL_9: '/assets/42ecb902decfc8e83a7446a0904b1e18.svg'
}

type userFlags = {
  STAFF: number;
  PARTNER: number;
  CERTIFIED_MODERATOR: number;
  HYPESQUAD: number;
  HYPESQUAD_ONLINE_HOUSE_1: number;
  HYPESQUAD_ONLINE_HOUSE_2: number;
  HYPESQUAD_ONLINE_HOUSE_3: number;
  BUG_HUNTER_LEVEL_1: number;
  BUG_HUNTER_LEVEL_2: number;
  VERIFIED_DEVELOPER: number;
  ACTIVE_DEVELOPER: number;
  PREMIUM_EARLY_SUPPORTER: number;
}

const constants = webpack.getBySource("ACTIVE_DEVELOPER:1") as types.ModuleExports
const UserFlags = webpack.getExportsForProps(constants, ["ACTIVE_DEVELOPER", "HYPESQUAD_ONLINE_HOUSE_1"]) as userFlags;
const { profileBadge18 } = webpack.getByProps('profileBadge18') as Record<string, string>;

export function badge(args: { kind: string, param?: number | string }, Tooltip: TooltipType, Messages: Record<string, string & {format: (args: unknown) => string}>): JSX.Element {
  let tooltip: string, asset: string;
  const { kind, param } = args;
  

  if (kind === 'staff') {
    tooltip = Messages.STAFF_BADGE_TOOLTIP
    asset = BadgeAssets.STAFF
  }

  if (kind === 'partner') {
    tooltip = Messages.PARTNER_BADGE_TOOLTIP
    asset = BadgeAssets.PARTNER
  }

  if (kind === 'certifiedPedo') {
    tooltip = Messages.CERTIFIED_MODERATOR_BADGE_TOOLTIP
    asset = BadgeAssets.CERTIFIED_MODERATOR
  }

  if (kind === 'hypesquad') {
    tooltip = Messages.HYPESQUAD_BADGE_TOOLTIP
    asset = BadgeAssets.HYPESQUAD
  }

  if (kind === 'hypesquadOnline') {
    tooltip = Messages.HYPESQUAD_ONLINE_BADGE_TOOLTIP.format({ houseName: Messages[`HYPESQUAD_HOUSE_${param}`] })
    asset = BadgeAssets[`HYPESQUAD_ONLINE_HOUSE_${param}`]
  }

  if (kind === 'hunter') {
    tooltip = Messages.BUG_HUNTER_BADGE_TOOLTIP
    asset = BadgeAssets[`BUG_HUNTER_LEVEL_${param}`]
  }

  if (kind === 'verifiedDev') {
    tooltip = Messages.VERIFIED_DEVELOPER_BADGE_TOOLTIP
    asset = BadgeAssets.EARLY_VERIFIED_DEVELOPER
  }

  if (kind === 'activeDev') {
    tooltip = Messages.ACTIVE_DEVELOPER_BADGE_TOOLTIP
    asset = BadgeAssets.ACTIVE_DEVELOPER
  }

  if (kind === 'earlySupporter') {
    tooltip = Messages.EARLY_SUPPORTER_TOOLTIP
    asset = BadgeAssets.EARLY_SUPPORTER
  }

  if (kind === 'premium') {
    tooltip = Messages.PREMIUM_BADGE_TOOLTIP.format({ date: new Date(param!) })
    asset = BadgeAssets.PREMIUM
  }

  if (kind === 'boosting') {
    tooltip = Messages.PREMIUM_GUILD_SUBSCRIPTION_TOOLTIP.format({ date: new Date(param!) })
    asset = BadgeAssets.PREMIUM_GUILD_SUBSCRIPTION_LEVEL_1//${userLevel.getUserLevel(param)}`]
  }

  return (
    <Tooltip text={tooltip!}>
      {(props: React.HTMLAttributes<HTMLSpanElement>) => (
        <span {...props} role="button" tabIndex={0}>
          <img alt='' src={asset} className={profileBadge18}/>
        </span>
      )}
    </Tooltip>
  )
}

export const cache: Record<string, User> = {}

// function fetchBadges(id: string): {premiumSince: unknown, premiumGuildSince: unknown} {

// }

export default function Badges(Tooltip: TooltipType, Messages: {}) {
  return (props: { user: User, premium: { premiumSince: string, premiumGuildSince: string } & Record<string, string> }): JSX.Element => {
    const { user, premium } = props;
    if (!Tooltip) {
      console.log("Tooltip not found");
      return <></>;
    }

    const badges = [
      (user.publicFlags & UserFlags.STAFF) !== 0 && { kind: 'staff' },
      (user.publicFlags & UserFlags.PARTNER) !== 0 && { kind: 'partner' },
      (user.publicFlags & UserFlags.CERTIFIED_MODERATOR) !== 0 && { kind: 'certifiedPedo' },
      (user.publicFlags & UserFlags.HYPESQUAD) !== 0 && { kind: 'hypesquad' },
      (user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_1) !== 0 && { kind: 'hypesquadOnline', param: 1 },
      (user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_2) !== 0 && { kind: 'hypesquadOnline', param: 2 },
      (user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_3) !== 0 && { kind: 'hypesquadOnline', param: 3 },
      (user.publicFlags & UserFlags.BUG_HUNTER_LEVEL_1) !== 0 && { kind: 'hunter', param: 1 },
      (user.publicFlags & UserFlags.BUG_HUNTER_LEVEL_2) !== 0 && { kind: 'hunter', param: 2 },
      (user.publicFlags & UserFlags.VERIFIED_DEVELOPER) !== 0 && { kind: 'verifiedDev' },
      (user.publicFlags & UserFlags.ACTIVE_DEVELOPER) !== 0 && { kind: 'activeDev' },
      (user.publicFlags & UserFlags.PREMIUM_EARLY_SUPPORTER) !== 0 && { kind: 'earlySupporter' },
      premium && { kind: 'premium', param: premium.premiumSince },
      premium && { kind: 'boosting', param: premium.premiumGuildSince },
    ].filter(Boolean);

    return <div className="badges">
      {badges.map((b) => b && badge(b, Tooltip, Messages))}
    </div>
  }
}
