/*
 * Copyright (c) 2020 Bowser65
 * Licensed under the Open Software License version 3.0
 */

const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { Plugin } = require('powercord/entities');

const Settings = require('./components/Settings');
const Badges = require('./components/Badges');

module.exports = class BadgesEverywhere extends Plugin {
  async startPlugin () {
    this.loadStylesheet('style.scss');
    powercord.api.settings.registerSettings('morebadges', {
      category: this.entityID,
      label: 'Badges Everywhere',
      render: Settings
    });

    this.classes = await getModule([ 'profileBadgeStaff' ]);
    this.ConnectedBadges = this.settings.connectStore(Badges);

    this._injectMembers();
    this._injectDMs();
    this._injectMessages();
  }

  pluginWillUnload () {
    powercord.api.settings.unregisterSettings('morebadges');
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
    const _this = this;
    const MessageTimestamp = await getModule([ 'MessageTimestamp' ]);
    inject('morebadges-messages', MessageTimestamp, 'default', (args, res) => {
      if (!_this.settings.get('messages', true)) {
        return res;
      }

      const header = res.props.children[1];

      const index = header.props.children.indexOf(header.props.children.find(c => c.props?.timestamp));
      const element = React.createElement('div', { className: `badges ${_this.classes.topSectionNormal}` },
        React.createElement(this.ConnectedBadges, { user: args[0].message.author })
      );

      header.props.children.splice(index, 0, element);
      return res;
    });
  }
};
