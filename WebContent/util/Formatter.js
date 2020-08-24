sap.ui.define(["sap/ui/core/format/DateFormat"],
	function (DateFormat) {
		"use strict";

		var Formatter = {
            // stdListItemType : function(uid, myUid) {
            //     return (uid !== myUid);
            // }
            timestampFmt: function (fbTimestamp) {
                if (fbTimestamp) {
                    var jsDate = fbTimestamp.toDate();
                    var oFormat = DateFormat.getInstance({
                        pattern: "dd MMMM yyyy HH:mm:ss"
                    });
                    var date = oFormat.format(jsDate);
                    return date;
                } else {return null;}
            }
        };

		return Formatter;
},true);
