/*global firebase*/
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"

], function (Controller, JSONModel) {

    "use strict";

    return Controller.extend("time2sheet.controller.leftpanel", {

        onInit: function () {
            console.log("leftpanel onInit");
            var oModel = new JSONModel();
            this.getView().setModel(oModel, "mLeft");
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    var currentUserId = user.uid,
                        sTitle;
                    console.log("current user", currentUserId);
                    var currentUserRef = firebase.firestore().collection("/users").doc(currentUserId);
                    currentUserRef.onSnapshot(function (doc) {
                        if (doc.exists) {
                            this.getCountOfMessages();
                            console.time();
                            console.log("Document data:", doc.data());
                            sTitle = doc.get("fName") + " " + doc.get("lName");
                            var sAvatar = doc.get("avatar");
                            if (this.getView().getModel("mLeft").getProperty("/avatarIcon") !== sAvatar) {
                                this.getView().getModel("mLeft").setProperty("/avatarIcon", sAvatar);
                            }
                            this.byId("leftPageTitle").setText(sTitle);
                            this.getOwnerComponent().getModel("mComponent").setProperty("/myAvatar", sAvatar);
                        } else {
                            console.log("No such document!");
                            this.getView().getModel("mLeft").setProperty("/avatarIcon",
                                this.getOwnerComponent().getModel("mComponent").getProperty("/fallbackAvatar"));
                        }
                    }.bind(this));
                }  else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("login");
                }
            }.bind(this));
            setInterval(
                this.getCountOfMessages.bind(this), 60000
            );
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.getRoute("leftpanel").attachMatched(this._onRouteMatched, this);

        }
    });
});
