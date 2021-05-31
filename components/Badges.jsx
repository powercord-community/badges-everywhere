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

const { React, Flux, getModule, http: { get }, constants: { Endpoints, UserFlags } } = require('powercord/webpack');
const { AsyncComponent, Tooltip } = require('powercord/components');
const { sleep } = require('powercord/util');

let noReq = false;
let executing = false;
async function doGet (endpoint) {
  // eslint-disable-next-line no-unmodified-loop-condition
  while (executing) {
    await sleep(10);
  }

  executing = true;
  let res;
  while (!res) {
    if (noReq) {
      res = { body: {} };
      break;
    }
    try {
      res = await get(endpoint);
    } catch (e) {
      if (e.status === 429) {
        if (!e.body) {
          console.log('Encountered hard cloudflare limit. Disabling requests.');
          noReq = true;
          res = { body: {} };
          break;
        } else {
          await sleep(e.body.retry_after);
        }
      } else {
        res = { body: {} };
      }
    }
  }

  setTimeout(() => (executing = false), 350);
  return res;
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
    }
  }

  render () {
    if (!this.props.user) {
      return null;
    }
    return <>
      {this.props.getSetting('displayStaff', true) && (this.props.user.publicFlags & UserFlags.STAFF) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.STAFF_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeStaff}/>
      </Tooltip>}

      {this.props.getSetting('displayPartner', true) && (this.props.user.publicFlags & UserFlags.PARTNER) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.PARTNER_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgePartner}/>
      </Tooltip>}

      {this.props.getSetting('displayCertifiedModerator', true) && (this.props.user.publicFlags & UserFlags.CERTIFIED_MODERATOR) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.CERTIFIED_MODERATOR_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeCertifiedModerator}/>
      </Tooltip>}

      {this.props.getSetting('displayHypeSquad', true) && (this.props.user.publicFlags & UserFlags.HYPESQUAD) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.HYPESQUAD_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeHypesquad}/>
      </Tooltip>}

      {this.props.getSetting('displayHypeSquadOnline', true) && <>
        {(this.props.user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_1) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.HYPESQUAD_ONLINE_BADGE_TOOLTIP.format({ houseName: this.props.i18n.Messages.HYPESQUAD_HOUSE_1 })}
          delay={500}
        >
          <div
            className={this.props.classes[`profileBadgeHypeSquadOnlineHouse1${this.props.hsWinners === 1 ? 'Winner' : ''}`]}/>
        </Tooltip>}

        {(this.props.user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_2) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.HYPESQUAD_ONLINE_BADGE_TOOLTIP.format({ houseName: this.props.i18n.Messages.HYPESQUAD_HOUSE_2 })}
          delay={500}
        >
          <div
            className={this.props.classes[`profileBadgeHypeSquadOnlineHouse2${this.props.hsWinners === 2 ? 'Winner' : ''}`]}/>
        </Tooltip>}

        {(this.props.user.publicFlags & UserFlags.HYPESQUAD_ONLINE_HOUSE_3) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.HYPESQUAD_ONLINE_BADGE_TOOLTIP.format({ houseName: this.props.i18n.Messages.HYPESQUAD_HOUSE_3 })}
          delay={500}
        >
          <div
            className={this.props.classes[`profileBadgeHypeSquadOnlineHouse3${this.props.hsWinners === 3 ? 'Winner' : ''}`]}/>
        </Tooltip>}
      </>}

      {this.props.getSetting('displayHunter', true) && <>
        {(this.props.user.publicFlags & UserFlags.BUG_HUNTER_LEVEL_1) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.BUG_HUNTER_BADGE_TOOLTIP}
          delay={500}
        >
          <div className={this.props.classes.profileBadgeBugHunterLevel1}/>
        </Tooltip>}
        {(this.props.user.publicFlags & UserFlags.BUG_HUNTER_LEVEL_2) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.BUG_HUNTER_BADGE_TOOLTIP}
          delay={500}
        >
          <div className={this.props.classes.profileBadgeBugHunterLevel2}/>
        </Tooltip>}
      </>}

      {this.props.getSetting('displayVerifiedBotDeveloper', true) && (this.props.user.publicFlags & UserFlags.VERIFIED_DEVELOPER) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.VERIFIED_DEVELOPER_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeVerifiedDeveloper}/>
      </Tooltip>}

      {this.props.getSetting('displayEarly', true) && (this.props.user.publicFlags & UserFlags.PREMIUM_EARLY_SUPPORTER) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.EARLY_SUPPORTER_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeEarlySupporter}/>
      </Tooltip>}

      {this.props.getSetting('displayNitro', true) && this.state.premiumSince &&
      <Tooltip
        text={this.props.i18n.Messages.PREMIUM_BADGE_TOOLTIP.format({ date: new Date(this.state.premiumSince) })}
        delay={500}
      >
        <div className={this.props.classes.profileBadgePremium}/>
      </Tooltip>}

      {this.props.getSetting('displayBoosting', true) && this.state.premiumGuildSince &&
      <Tooltip
        text={this.props.i18n.Messages.PREMIUM_GUILD_SUBSCRIPTION_TOOLTIP.format({ date: new Date(this.state.premiumGuildSince) })}
        delay={500}
      >
        <div
          className={this.props.classes[`profileGuildSubscriberlvl${this.props.userLevelCompute.getUserLevel(this.state.premiumGuildSince)}`]}/>
      </Tooltip>}
    </>;
  }
}

Badges.cache = {};
let connectedModule = null;
module.exports = (props) => <AsyncComponent
  _provider={async () => {
    if (!connectedModule) {
      const i18n = await getModule([ 'Messages' ]);
      const classes = await getModule([ 'profileBadgeStaff' ]);
      const userLevelCompute = await getModule([ 'getUserLevel' ]);
      const hsWinners = await getModule(e => e.getExperimentId && e.getExperimentId().includes('hypesquad_winner'));

      connectedModule = Flux.connectStores([ hsWinners ], () => ({
        i18n,
        classes,
        userLevelCompute,
        hsWinners: hsWinners.getExperimentDescriptor() ? hsWinners.bucket : 0
      }))(Badges);
    }
    return connectedModule;
  }}
  {...props}
/>;
