/* Copyright (C) NAVER <http://www.navercorp.com> */

(function ($) {
	"use strict";

	$.fn.Krzip = function () {
		var $this = $(this);

		var values = {
			postcode      : $this.find(".krzip-hidden-postcode"),
			roadAddress   : $this.find(".krzip-hidden-roadAddress"),
			jibunAddress  : $this.find(".krzip-hidden-jibunAddress"),
			detailAddress : $this.find(".krzip-hidden-detailAddress"),
			extraAddress  : $this.find(".krzip-hidden-extraAddress")
		};

		var ui = {
			postcode      : $this.find(".krzip-postcode"),
			roadAddress   : $this.find(".krzip-roadAddress"),
			jibunAddress  : $this.find(".krzip-jibunAddress"),
			detailAddress : $this.find(".krzip-detailAddress"),
			extraAddress  : $this.find(".krzip-extraAddress"),
			search        : $this.find(".krzip-search"),
			guide         : $this.find(".krzip-guide")
		};

		var postcode_format = $this.data("postcode-format") == "5" ? "5" : "6";

		values.postcode.addClass("postcodify_postcode" + postcode_format);
		values.roadAddress.addClass("postcodify_address");
		values.jibunAddress.addClass("postcodify_jibeon_address");
		values.detailAddress.addClass("postcodify_details");
		values.extraAddress.addClass("postcodify_extra_info");

		ui.postcode.addClass("postcodify_postcode" + postcode_format);
		ui.roadAddress.addClass("postcodify_address");
		ui.jibunAddress.addClass("postcodify_jibeon_address");
		ui.detailAddress.addClass("postcodify_details");
		ui.extraAddress.addClass("postcodify_extra_info");

		ui.search.postcodifyPopUp({
			inputParent : $this,
			useFullJibeon : false,
			requireExactQuery : false,
			forceDisplayPostcode5 : (postcode_format == "5") ? true : false,
			onSelect : function () {
				var jibun = ui.jibunAddress.val();
				if(jibun) {
					values.jibunAddress.val("(" + jibun + ")");
					ui.jibunAddress.val("(" + jibun + ")");
				}
			}
		});
	};
})(jQuery);

/* End of file postcodify.js */
/* Location: ./modules/krzip/tpl/js/postcodify.js */
