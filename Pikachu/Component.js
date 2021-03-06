sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast"
], function (Component, Button, Bar, MessageToast) {

	return Component.extend("com.pikachu.flp.plugin.Component", {

		metadata: {
			"manifest": "json" 
		},

		init: function () {
			this.renderRecastChatbot();
			var rendererPromise = this._getRenderer();

			// This is example code. Please replace with your implementation!
			/**
			 * Add a footer with a button
			 */
			rendererPromise.then(function (oRenderer) {
				oRenderer.setFooterControl("sap.m.Bar", {
					id: "myFooter",
					contentLeft: [new Button({
						text: "Important Information",
						press: function () {
							MessageToast.show("This SAP Fiori Launchpad has been extended to improve your experience");
						}
					})]
				});
			});

		},
		 renderRecastChatbot: function() {
	if (!document.getElementById("cai-webchat")) { 
		var s = document.createElement("script");
	 	  s.setAttribute("id", "cai-webchat");
		  s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
			  document.body.appendChild(s);
		}
		s.setAttribute("channelId", "761781da-de85-4a45-a3f0-58c08193fce5");
		s.setAttribute("token", "5f54e97b3bc98737e5591a6726bbd66f");
},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});