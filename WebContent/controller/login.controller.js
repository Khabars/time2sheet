/*global firebase, firebaseui*/
sap.ui.define( [
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"

], function(Controller, JSONModel) {

"use strict";

	return Controller.extend( "time2sheet.controller.login", {

		onInit: function() {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("login").attachPatternMatched(this._onRouteMatched, this);
			this.loginUi = new firebaseui.auth.AuthUI(firebase.auth());
			this.oBusy = this.getOwnerComponent().oBusy;
			this.loginUiConfig = {
				callbacks: {
					signInSuccessWithAuthResult: this.loginSuccess.bind(this),
					uiShown: function() {this.oBusy.close();}.bind(this)
				},
				signInOptions: [
					firebase.auth.GoogleAuthProvider.PROVIDER_ID
				]
			};
		},

		_onRouteMatched: function(oEvent) {
			console.log("login route matched");
			this.oBusy.open();
			firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
				.then(function() {
					this.loginUi.start("#" + this.getView()
						.byId("firebaseui-auth-container").getId(), this.loginUiConfig);
				}.bind(this))
		},

		loginSuccess: function(oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var defaultAvatar = this.getOwnerComponent().getModel("mComponent").getProperty("/fallbackAvatar");
			var authUid = oEvent.user.uid;
			var authFLname = oEvent.user.displayName;
			var sphoneNumber = oEvent.user.phoneNumber;
			var emailVerified = oEvent.user.emailVerified;
			if (!sphoneNumber) {
				var sphoneNumber = "+12345678910";
			}
			if (!authFLname) {
				var authFLname = "Имя Фамилия";
			}
			var arr = authFLname.split(" ");
			var authFName = arr[0];
			var authLName = arr[1] || " ";
			var oUserNew = {
				fName: authFName,
				lName: authLName,
				avatar: defaultAvatar,
				uid: authUid,
				city: "Белгород",
				phoneNumber: sphoneNumber,
				timestamp: firebase.firestore.FieldValue.serverTimestamp()
			  };
			var currentUserRef = firebase.firestore().collection("/users").doc(authUid);
			var usersCollection = firebase.firestore().collection("/users");
			if (!emailVerified) {
				oRouter.navTo("emailverify");
				return false;
			}
			currentUserRef.get().then(function (userDoc) {
				if (userDoc.exists) {
					console.log("loginSuccess");
					if (this.toProduct) {
						oRouter.navTo("goodsdetail", { product: this.toProduct });
					} else if (this.toCollection) {
						oRouter.navTo("goods", { collection: this.toCollection });
					} else {
						oRouter.navTo("news");
					}
					return false;
				} else {
					usersCollection.doc(authUid).set(oUserNew);
					if (this.toProduct) {
						oRouter.navTo("goodsdetail", { product: this.toProduct });
					} else if (this.toCollection) {
						oRouter.navTo("goods", { collection: this.toCollection });
					} else {
						oRouter.navTo("news");
					}
					return false;
				}
			}.bind(this));
		}
	});
});