/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const { React, Flux, getModule, http: { get }, constants: { Endpoints, UserFlags } } = require('powercord/webpack');
const { AsyncComponent, Tooltip } = require('powercord/components');

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
    
    if (!Badges.cache[this.props.user.id]) {
      Badges.cache[this.props.user.id] = {
        loaded: false,
        promise: new Promise(async resolve => {
          /*
           * This makes me VERY sad but there aren't any better solutions. However, since most of Discord
           * uses lazy scrollers, request amount isn't very intensive.
           */
          if (!this.props.user.bot && !this.props.user.username.includes('Deleted User')) {
            // eslint-disable-next-line new-cap
            const res = await get(Endpoints.USER_PROFILE(this.props.user.id));
            Badges.cache[this.props.user.id] = {
              loaded: true,
              flags: res.body.user.flags,
              premiumSince: res.body.premium_since,
              premiumGuildSince: res.body.premium_guild_since
            };
            resolve(Badges.cache[this.props.user.id]);
          }
        })
      };
    }
    if (!Badges.cache[this.props.user.id].loaded) {
      this.setState(await Badges.cache[this.props.user.id].promise);
    }
  }

  render () {
    if (!this.props.user || !this.state.loaded) {
      return null;
    }
    return <>
      {this.props.getSetting('displayStaff', true) && (this.state.flags & UserFlags.STAFF) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.STAFF_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeStaff}/>
      </Tooltip>}

      {this.props.getSetting('displayPartner', true) && (this.state.flags & UserFlags.PARTNER) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.PARTNER_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgePartner}/>
      </Tooltip>}

      {this.props.getSetting('displayHypeSquad', true) && (this.state.flags & UserFlags.HYPESQUAD) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.HYPESQUAD_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeHypesquad}/>
      </Tooltip>}

      {this.props.getSetting('displayHypeSquadOnline', true) && <>
        {(this.state.flags & UserFlags.HYPESQUAD_ONLINE_HOUSE_1) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.HYPESQUAD_ONLINE_BADGE_TOOLTIP.format({ houseName: this.props.i18n.Messages.HYPESQUAD_HOUSE_1 })}
          delay={500}
        >
          <div
            className={this.props.classes[`profileBadgeHypeSquadOnlineHouse1${this.props.hsWinners === 1 ? 'Winner' : ''}`]}/>
        </Tooltip>}

        {(this.state.flags & UserFlags.HYPESQUAD_ONLINE_HOUSE_2) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.HYPESQUAD_ONLINE_BADGE_TOOLTIP.format({ houseName: this.props.i18n.Messages.HYPESQUAD_HOUSE_2 })}
          delay={500}
        >
          <div
            className={this.props.classes[`profileBadgeHypeSquadOnlineHouse2${this.props.hsWinners === 2 ? 'Winner' : ''}`]}/>
        </Tooltip>}

        {(this.state.flags & UserFlags.HYPESQUAD_ONLINE_HOUSE_3) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.HYPESQUAD_ONLINE_BADGE_TOOLTIP.format({ houseName: this.props.i18n.Messages.HYPESQUAD_HOUSE_3 })}
          delay={500}
        >
          <div
            className={this.props.classes[`profileBadgeHypeSquadOnlineHouse3${this.props.hsWinners === 3 ? 'Winner' : ''}`]}/>
        </Tooltip>}
      </>}

      {this.props.getSetting('displayHunter', true) && <>
        {(this.state.flags & UserFlags.BUG_HUNTER_LEVEL_1) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.BUG_HUNTER_BADGE_TOOLTIP}
          delay={500}
        >
          <div className={this.props.classes.profileBadgeBugHunterLevel1}/>
        </Tooltip>}
        {(this.state.flags & UserFlags.BUG_HUNTER_LEVEL_2) !== 0 &&
        <Tooltip
          text={this.props.i18n.Messages.BUG_HUNTER_BADGE_TOOLTIP}
          delay={500}
        >
          <div className={this.props.classes.profileBadgeBugHunterLevel2}/>
        </Tooltip>}
      </>}

      {this.props.getSetting('displayVerifiedBotDeveloper', true) && (this.state.flags & UserFlags.VERIFIED_DEVELOPER) !== 0 &&
      <Tooltip
        text={this.props.i18n.Messages.VERIFIED_DEVELOPER_BADGE_TOOLTIP}
        delay={500}
      >
        <div className={this.props.classes.profileBadgeVerifiedDeveloper}/>
      </Tooltip>}

      {this.props.getSetting('displayEarly', true) && (this.state.flags & UserFlags.PREMIUM_EARLY_SUPPORTER) !== 0 &&
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
