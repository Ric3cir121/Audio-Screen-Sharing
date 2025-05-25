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
import {Extension, gettext, ngettext, pgettext} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class AudioScreenSharing extends Extension {
    enable() {
        // Add a menu item to open the preferences window
        this._indicator.menu.addAction(gettext('Preferences'),
            () => this.openPreferences());

        // Create a new GSettings object, and bind the "show-indicator"
        // setting to the "visible" property.
        this._settings = this.getSettings();
        this._settings.bind('show-indicator', this._indicator, 'visible', Gio.SettingsBindFlags.DEFAULT);

        // Watch for changes to a specific setting
        this._settings.connect('changed::show-indicator', (settings, key) => {
            console.debug(`${key} = ${settings.get_value(key).print(true)}`);
        });
    }

    disable() {
    }
}
