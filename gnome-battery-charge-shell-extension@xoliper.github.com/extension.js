'use strict';

//Accessing the Panel UI
const Main 			= imports.ui.main;
const PopupMenu 	= imports.ui.popupMenu;

//Action callbacks handling
const Lang 			= imports.lang;

//Managing schema
const Gio 			= imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Me 			= imports.misc.extensionUtils.getCurrentExtension();

class Extension
{
    
    constructor()
    {
    	this._settings = ExtensionUtils.getSettings('org.gnome.BatteryChargeManager');
		this._aggregateMenu = Main.panel.statusArea.aggregateMenu;
		this._powerMenu = this._aggregateMenu._power.menu.firstMenuItem.menu;
    }

    enable()
    {        
    	this._switch = new PopupMenu.PopupSwitchMenuItem(_("Charge Threshold"), this._settings.get_boolean('battery-charge-threshold-enabled'));
		this._powerMenu.addMenuItem(this._switch);				
		
		this._observer = this._settings.connect('changed', () => {
			if (this._settings.get_boolean('battery-charge-threshold-enabled') === true) {
				this._switch.setToggleState(true);
		    } else {
				this._switch.setToggleState(false);
		    }
		});
		
		this._switch.connect('toggled', Lang.bind(this, function(object, value){
			if(value) {
				this._settings.set_boolean('battery-charge-threshold-enabled', true);
			} else {
				this._settings.set_boolean('battery-charge-threshold-enabled', false);
			}
		}));
    }

    disable()
    {
		this._switch.destroy();
    }     
}

function init()
{
    return new Extension();
}

