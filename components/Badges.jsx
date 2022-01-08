/*
 * Copyright (c) 2020-2021 Cynthia K. Rey, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

const { React, getModule, http: { get }, constants: { Endpoints, UserFlags }, i18n: { Messages } } = require('powercord/webpack');
const { Tooltip } = require('powercord/components');
const { sleep } = require('powercord/util');

const BadgeAssets = {
  STAFF: '/assets/f62be1ec9bdd82d3d77158ad81830e68.svg',
  PARTNER: '/assets/53828e0c0fb6676440ad11b5d2586241.svg',
  HYPESQUAD: '/assets/f5354673c9cff61c1dcc70081ef774e5.svg',
  HYPESQUAD_ONLINE_HOUSE_1: '/assets/995ecfdbdf94ad84dd4d802c104e4630.svg',
  HYPESQUAD_ONLINE_HOUSE_2: '/assets/473dadec13ab7e90e209cc60fccb31c5.svg',
  HYPESQUAD_ONLINE_HOUSE_3: '/assets/58f11abcf3c13812bff969baaeb84d82.svg',
  BUG_HUNTER_LEVEL_1: '/assets/46f6a28f462889f1a36cfca2591fcade.svg',
  BUG_HUNTER_LEVEL_2: '/assets/5c6bb5c4640972078fc993f1b5f503ce.svg',
  EARLY_VERIFIED_DEVELOPER: '/assets/877dc8bece1590e63fac6d5a0cd2a225.svg',
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

let executing = 0;
async function doGet (endpoint) {
  await sleep(1500 * executing++);

  let res, tries = 0;
  while (!res && tries < 5) {
    tries++
    try {
      res = await get(endpoint);
    } catch (e) {
      if (e.status === 429) {
        await sleep(5e3);
      } else {
        res = { body: {} };
      }
    }
  }

  executing--;
  return res;
}

const userLevel = getModule([ 'getUserLevel' ], false)
function Badge ({ kind, param }) {
  let tooltip, asset

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

  if (kind === 'earlySupporter') {
    tooltip = Messages.EARLY_SUPPORTER_TOOLTIP
    asset = BadgeAssets.EARLY_SUPPORTER
  }

  if (kind === 'premium') {
    tooltip = Messages.PREMIUM_BADGE_TOOLTIP.format({ date: new Date(param) })
    asset = BadgeAssets.PREMIUM
  }

  if (kind === 'boosting') {
    tooltip = Messages.PREMIUM_GUILD_SUBSCRIPTION_TOOLTIP.format({ date: new Date(param) })
    asset = BadgeAssets[`PREMIUM_GUILD_SUBSCRIPTION_LEVEL_${userLevel.getUserLevel(param)}`]
  }

  return (
    <Tooltip text={tooltip} delay={500}>
      <img alt='' src={asset} className='profileBadge18-NVHzY4 profileBadge-2niAfJ desaturate-qhyunI'/>
    </Tooltip>
  )
}

class Badges extends React.PureComponent {
  constructor (props) {
    super(props);
    if (props.user) {
      this.state = Badges.cache[props.user.id] || { loaded: false };
    }
  }

  async componentDidMount () {
    if (!this.props.user) {
      return;
    }

    if (this.props.getSetting('displayNitro', true) || this.props.getSetting('displayBoosting', true)) {
      if (Badges.cache[this.props.user.id]) {
        this.setState(Badges.cache[this.props.user.id]);
      } else {
        this._fetchBadges();
      }
    }
  }

  async _fetchBadges () {
    Badges.cache[this.props.user.id] = {};
    if (!this.props.user.bot && !this.props.user.username.includes('Deleted User')) {
      // eslint-disable-next-line new-cap
      const res = await doGet(Endpoints.USER_PROFILE(this.props.user.id));
      Badges.cache[this.props.user.id] = {
        premiumSince: res.body.premium_since,
        premiumGuildSince: res.body.premium_guild_since
      };

      this.setState(Badges.cache[this.props.user.id]);
    }
  }

  render () {
    if (!this.props.user) {
      return null;
    }

    const { getSetting, user } = this.props
    const badges = [
      getSetting('displayStaff', true) && (user.publicFlags & UserFlags.STAFF) !== 0 && { kind: 'staff' },
      getSetting('displayPartner', true) && (user.publicFlags & UserFlags.PARTNER) !== 0 && { kind: 'partner' },
      getSetting('displayCertifiedModerator', true) && (user.publicFlags & UserFlags.CERTIFIED_MODERATOR) !== 0 && { kind: 'certifiedPedo' },
      getSetting('displayHypeSquad', true) && (user.publicFlags & UserFlags.HYPESQUAD) !== 0 && { kind: 'hypesquad' },
      getSetting('displayHypeSquadOnline', true) && (user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_1) !== 0 && { kind: 'hypesquadOnline', param: 1 },
      getSetting('displayHypeSquadOnline', true) && (user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_2) !== 0 && { kind: 'hypesquadOnline', param: 2 },
      getSetting('displayHypeSquadOnline', true) && (user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_3) !== 0 && { kind: 'hypesquadOnline', param: 3 },
      getSetting('displayHunter', true) && (user.publicFlags & UserFlags.BUG_HUNTER_LEVEL_1) !== 0 && { kind: 'hunter', param: 1 },
      getSetting('displayHunter', true) && (user.publicFlags & UserFlags.BUG_HUNTER_LEVEL_2) !== 0 && { kind: 'hunter', param: 2 },
      getSetting('displayVerifiedBotDeveloper', true) && (user.publicFlags & UserFlags.VERIFIED_DEVELOPER) !== 0 && { kind: 'verifiedDev' },
      getSetting('displayEarly', true) && (user.publicFlags & UserFlags.PREMIUM_EARLY_SUPPORTER) !== 0 && { kind: 'earlySupporter' },
      getSetting('displayNitro', true) && this.state.premiumSince && { kind: 'premium', param: this.state.premiumSince },
      getSetting('displayBoosting', true) && this.state.premiumGuildSince && { kind: 'boosting', param: this.state.premiumGuildSince },
    ].filter(Boolean)

    return badges.map((b) => React.createElement(Badge, b))
  }
}

Badges.cache = {};
Badges.Badge = Badge;
module.exports = Badges
