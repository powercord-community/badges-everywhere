/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const { React } = require('powercord/webpack');
const { Category, SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);

    this.classes = powercord.pluginManager.get('badges-everywhere').classes;
    this.state = { opened: false };
  }

  render () {
    return (
      <div className='morebadges'>
        <SwitchItem
          note='Display badges in chat messages.'
          value={this.props.getSetting('messages', true)}
          onChange={() => this.props.toggleSetting('messags', true)}
        >
          Messages
        </SwitchItem>
        <SwitchItem
          note='Display badges in the list of members.'
          value={this.props.getSetting('members', true)}
          onChange={() => this.props.toggleSetting('members')}
        >
          Member List
        </SwitchItem>
        <SwitchItem
          note='Display badges in the list of DMs.'
          value={this.props.getSetting('dms', true)}
          onChange={() => this.props.toggleSetting('dms')}
        >
          DM Channels List
        </SwitchItem>
        <Category
          name='Displayed badges'
          description={'Hide some badges you don\'t care about.'}
          opened={this.state.opened}
          onChange={() => this.setState({ opened: !this.state.opened })}
        >
          <SwitchItem
            value={this.props.getSetting('displayStaff', true)}
            onChange={() => this.props.toggleSetting('displayStaff', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Discord Staff</span>
              <div className={this.classes.profileBadgeStaff}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayPartner', true)}
            onChange={() => this.props.toggleSetting('displayPartner', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Discord Partner</span>
              <div className={this.classes.profileBadgePartner}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayHypeSquad', true)}
            onChange={() => this.props.toggleSetting('displayHypeSquad', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Discord HypeSquad (Events)</span>
              <div className={this.classes.profileBadgeHypesquad}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayHypeSquadOnline', true)}
            onChange={() => this.props.toggleSetting('displayHypeSquadOnline', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Discord HypeSquad (Houses)</span>
              <div className={this.classes.profileBadgeHypeSquadOnlineHouse1}/>
              <div className={this.classes.profileBadgeHypeSquadOnlineHouse2}/>
              <div className={this.classes.profileBadgeHypeSquadOnlineHouse3}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayHunter', true)}
            onChange={() => this.props.toggleSetting('displayHunter', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Bug Hunter</span>
              <div className={this.classes.profileBadgeBugHunter}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayEarly', true)}
            onChange={() => this.props.toggleSetting('displayEarly', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Early Supporter</span>
              <div className={this.classes.profileBadgeEarlySupporter}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayNitro', true)}
            onChange={() => this.props.toggleSetting('displayNitro', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Discord Nitro</span>
              <div className={this.classes.profileBadgePremium}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayBoosting', true)}
            onChange={() => this.props.toggleSetting('displayBoosting', true)}
          >
            <div className={`badges ${this.classes.topSectionNormal}`}>
              <span>Nitro Boosting</span>
              <div className={this.classes.profileGuildSubscriberlvl1}/>
              <div className={this.classes.profileGuildSubscriberlvl2}/>
              <div className={this.classes.profileGuildSubscriberlvl3}/>
              <div className={this.classes.profileGuildSubscriberlvl4}/>
              <div className={this.classes.profileGuildSubscriberlvl5}/>
              <div className={this.classes.profileGuildSubscriberlvl6}/>
              <div className={this.classes.profileGuildSubscriberlvl7}/>
              <div className={this.classes.profileGuildSubscriberlvl8}/>
              <div className={this.classes.profileGuildSubscriberlvl9}/>
            </div>
          </SwitchItem>
        </Category>
      </div>
    );
  }
};
