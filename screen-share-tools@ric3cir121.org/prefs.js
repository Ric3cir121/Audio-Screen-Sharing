/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk?version=4.0';

import {ExtensionPreferences, gettext, ngettext, pgettext} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class AudioScreenSharingPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();
        

        const page = new Adw.PreferencesPage({
            title: gettext('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);


        const mainPage = new Adw.PreferencesGroup({
            title: gettext('Screen share with audio'),
        });
        page.add(mainPage);


        const enableAudioScreenSharing = new Adw.SwitchRow({
            title: gettext('Enable audio on screen shares'),
            subtitle: gettext('Apps will be able to record audio along with the screen or single apps'),
        });
        mainPage.add(enableAudioScreenSharing);
        window._settings.bind('enable-audio-screen-sharing', enableAudioScreenSharing, 'active', Gio.SettingsBindFlags.DEFAULT);


        const audioScreenShareMethods = [{
            name: "Record audio",
            id: "redirectOutput",
            description: "Redirects apps audio output to a channel that is recorded",
        },{
            name: "Always record audio of all apps",
            id: "alwaysRecordChannel",
            description: "Records from all of the apps",
        },{
            name: "Record audio of all apps only when sharing the entire screen",
            id: "recordChannel",
            description: "Records from all of the apps only when sharing the entire screen",
        }];
        let aSSMButtonsGroup;
        const aSSActiveMethod = window._settings.get_string('audio-screen-sharing-method');
        for(const aSSMethod of audioScreenShareMethods){
            const actionRow = new Adw.ActionRow({
                title: gettext(aSSMethod.name),
                subtitle: gettext(aSSMethod.description),
            });
            mainPage.add(actionRow);

            const CheckButton = new Gtk.CheckButton({active: aSSActiveMethod == aSSMethod.id});
            if(aSSMButtonsGroup === undefined)
                aSSMButtonsGroup = CheckButton;
            else
                CheckButton.set_group(aSSMButtonsGroup);
            
            actionRow.add_prefix(CheckButton);
            actionRow.set_activatable_widget(CheckButton);

            window._settings.bind('enable-audio-screen-sharing', actionRow, 'sensitive', Gio.SettingsBindFlags.DEFAULT);
            CheckButton.connect('toggled', ()=>{ window._settings.set_string('audio-screen-sharing-method', aSSMethod.id) })
        }
    }
}
