/**
 * Badges Everywhere
 * Copyright (C) 2019 Bowser65
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { React } = require('powercord/webpack');
const { SwitchItem } = require('powercord/components/settings');

module.exports = class Settings extends React.Component {
  render () {
    return (
      <div>
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
          note='Display badges in the list of DMs'
          value={this.props.getSetting('dms', true)}
          onChange={() => this.props.toggleSetting('dms')}
        >
          DM Channels List
        </SwitchItem>
      </div>
    );
  }
};
