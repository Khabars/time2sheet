sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";
    return Controller.extend( "time2sheet.controller.App", {
        onInit: function() {
            console.log( "Init from app ctrl" );
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("login");
        }
    });
});
