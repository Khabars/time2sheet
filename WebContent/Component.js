sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/BusyDialog",
    "sap/ui/Device"
], function (UIComponent, JSONModel, BusyDialog, Device) {
    "use strict";

    return UIComponent.extend("time2sheet.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            sap.ui.core.UIComponent.prototype.init.apply( this, arguments);
            this.oBusy = new BusyDialog();
            this.oBusy.setBusyIndicatorDelay(0);
            this.setModel(this.createDeviceModel(), "device");
            this.getRouter().initialize();

        },
        
        createDeviceModel : function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        
        getContentDensityClass : function() {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                // eslint-disable-next-line sap-no-proprietary-browser-api
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        }
    });

});
