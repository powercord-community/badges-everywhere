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

const { resolve } = require('path');
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { Plugin } = require('powercord/entities');

const Settings = require('./components/Settings');
const Badges = require('./components/Badges');

module.exports = class BadgesEverywhere extends Plugin {
  async startPlugin () {
    this.loadCSS(resolve(__dirname, 'style.scss'));
    this.registerSettings('morebadges', 'Badges Everywhere', Settings);

    this.classes = await getModule([ 'profileBadgeStaff' ]);
    this.ConnectedBadges = this.settings.connectStore(Badges);

    this._injectMembers();
    this._injectDMs();
    this._injectMessages();
  }

  pluginWillUnload () {
    uninject('morebadges-dm');
    uninject('morebadges-members');
    uninject('morebadges-messages');
  }

  async _injectMembers () {
    const _this = this;
    const MemberListItem = await getModuleByDisplayName('MemberListItem');
    inject('morebadges-members', MemberListItem.prototype, 'renderDecorators', function (args, res) {
      if (!_this.settings.get('members', true)) {
        return res;
      }

      res.props.children.unshift(
        React.createElement('div', { className: `badges ${_this.classes.topSectionNormal}` },
          React.createElement(_this.ConnectedBadges, { user: this.props.user })
        )
      );
      return res;
    });
  }

  async _injectDMs () {
    const _this = this;
    const PrivateChannel = await getModuleByDisplayName('PrivateChannel');
    inject('morebadges-dm', PrivateChannel.prototype, 'render', function (args, res) {
      if (!_this.settings.get('dms', true)) {
        return res;
      }
      res.props.name = React.createElement('div', { className: `badges ${_this.classes.topSectionNormal}` }, [
        React.createElement('span', null, res.props.name),
        React.createElement(_this.ConnectedBadges, { user: this.props.user })
      ]);
      return res;
    });
  }

  async _injectMessages () {
    const { MessageUsername } = await getModule([ 'MessageUsername' ]);
    const _this = this;
    inject('morebadges-messages', MessageUsername.prototype, 'render', function (args, res) {
      if (!_this.settings.get('messages', true)) {
        return res;
      }
      const originalChild = res.props.children;
      res.props.children = (props) => [
        React.createElement(originalChild, props),
        React.createElement('div', { className: `badges ${_this.classes.topSectionNormal}` },
          React.createElement(_this.ConnectedBadges, { user: this.props.message.author })
        )
      ];
      return res;
    });
  }
};
