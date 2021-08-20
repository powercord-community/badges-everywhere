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

const { React, constants } = require('powercord/webpack');
const { Category, SwitchItem } = require('powercord/components/settings');
const { Badge } = require('./Badges');

module.exports = class Settings extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = { opened: false };
  }

  render () {
    const TODAY = new Date()
    const BOOSTING = Object.values(constants.UserPremiumGuildSubscriptionMonths)
      .map((m) => new Date().setUTCMonth(TODAY.getUTCMonth() - m + 1))

    return (
      <div className='morebadges'>
        <SwitchItem
          note='Display badges in chat messages.'
          value={this.props.getSetting('messages', true)}
          onChange={() => this.props.toggleSetting('messages', true)}
        >
          Messages
        </SwitchItem>
        <SwitchItem
          note='Display badges in threads preview in main chat.'
          value={this.props.getSetting('threads-preview', true)}
          onChange={() => this.props.toggleSetting('threads-preview', true)}
        >
          Threads
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
            <div className='badges'>
              <span>Discord Staff</span>
              <Badge kind='staff'/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayPartner', true)}
            onChange={() => this.props.toggleSetting('displayPartner', true)}
          >
            <div className='badges'>
              <span>Discord Partner</span>
              <Badge kind='partner'/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayCertifiedModerator', true)}
            onChange={() => this.props.toggleSetting('displayCertifiedModerator', true)}
          >
            <div className='badges'>
              <span>Discord Certified Moderator</span>
              <Badge kind='certifiedPedo'/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayHypeSquad', true)}
            onChange={() => this.props.toggleSetting('displayHypeSquad', true)}
          >
            <div className='badges'>
              <span>Discord HypeSquad (Events)</span>
              <Badge kind='hypesquad'/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayHypeSquadOnline', true)}
            onChange={() => this.props.toggleSetting('displayHypeSquadOnline', true)}
          >
            <div className='badges'>
              <span>Discord HypeSquad (Houses)</span>
              <Badge kind='hypesquadOnline' param={1}/>
              <Badge kind='hypesquadOnline' param={2}/>
              <Badge kind='hypesquadOnline' param={3}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayHunter', true)}
            onChange={() => this.props.toggleSetting('displayHunter', true)}
          >
            <div className='badges'>
              <span>Bug Hunter</span>
              <Badge kind='hunter' param={1}/>
              <Badge kind='hunter' param={2}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayVerifiedBotDeveloper', true)}
            onChange={() => this.props.toggleSetting('displayVerifiedBotDeveloper', true)}
          >
            <div className='badges'>
              <span>Bot Developer</span>
              <Badge kind='verifiedDev'/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayEarly', true)}
            onChange={() => this.props.toggleSetting('displayEarly', true)}
          >
            <div className='badges'>
              <span>Early Supporter</span>
              <Badge kind='earlySupporter'/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayNitro', true)}
            onChange={() => this.props.toggleSetting('displayNitro', true)}
          >
            <div className='badges'>
              <span>Discord Nitro</span>
              <Badge kind='premium' param={TODAY}/>
            </div>
          </SwitchItem>
          <SwitchItem
            value={this.props.getSetting('displayBoosting', true)}
            onChange={() => this.props.toggleSetting('displayBoosting', true)}
          >
            <div className='badges'>
              <span>Nitro Boosting</span>
              {BOOSTING.map((b) => <Badge kind='boosting' param={b}/>)}
            </div>
          </SwitchItem>
        </Category>
      </div>
    );
  }
};
