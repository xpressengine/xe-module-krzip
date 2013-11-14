(function($) {

	$.fn.krZip = function(options) {

		const STEP_SELECT_ADDR1 = 1;
		const STEP_SELECT_ADDR2 = 2;
		const STEP_INPUT_ADDR3 = 3;
		const STEP_SELECT_ADDR3 = 4;
		const STEP_INPUT_ADDR4 = 5;
		const STEP_COMPLETE = 6;
		
		
		
		// support mutltiple elements
		if (this.length > 1) {
			this.each(function() {
				$(this).krZip(options)
			});
			return this;
		}
		
		var settings = $.extend({}, options, {hostname:'http://cloud1.akasima1.cafe24.com/krzip'});
		var input_addr = []; // 사용자로부터 입력, 선택되는 정보, 0:광역시도/1:시군구/2:사용자가 입력한 상세검색주소
		var addr_first =''; // 사용자가 선택한 도로주소
		var addr_zipcode = '';
		var addr_second = ''; // 사용자가 입력한 나머지 주소

		var step = 0;
		var el = this; // only one element
		var ui = {
			'oldAddress' : this.find('.old_address'),
			'addr_first' : this.find('input.addr_first'),
			'addr_second' : this.find('input.addr_second'),
			'startBtn' : this.find('button.start_zip'),
			'viewer' : this.find('.addr_viewer.box'),
			'addr1selector' : this.find('.addr1_selector.box'),
			'addr2selector' : this.find('.addr2_selector.box'),
			'addr3input' : this.find('.addr3_input.box'),
			'addr3selector' : this.find('.addr3_selector.box'),
			'addr4input' : this.find('.addr4_input.box')
		}
		var search_next = 0; // 상세주소리스트 offset

		// [주소입력]버튼을 클릭
		ui.startBtn.click(function() {
			goStep1();
		});

		// 광역시도 주소(addr1)를 선택
		ui.addr1selector.on('click','a',function() {
			goStep2($(this).text());
			return false;
		});

		// 시/군/구 주소(addr2)를 선택
		ui.addr2selector.on('click','a',function() {
			goStep3($(this).text());
			return false;
		});

		// 상세주소(addr3)를 입력후 [검색]버튼을 클릭
		ui.addr3input.find('button.submit_addr3').click(function() {
			var input = ui.addr3input.find('.addr3_input').val();
			search_next = 0;
			if(input) goStep4(input);
		});
		// 상세주소(addr3)를 입력후 '엔터'
		ui.addr3input.find('input.addr3_input').keypress(function(event){
			if(event.keyCode!=13) return;
			ui.addr3input.find('button.submit_addr3').click();
			return false;
		});
		
		// 상세주소(addr3)를 선택
		ui.addr3selector.on('click', 'table a', 'click', function(){
			goStep5($(this).text(),$(this).parent('td').next('td').text());
			
			return false;
		});
		
		// 상세주소(addr3) 리스트 더보기 클릭
		ui.addr3selector.on('click', '.more_search', 'click', function(){
			goStep4();
			return false;
		});
		
		// 나머지주소(addr4) 입력후 [완료]버튼을 클릭
		ui.addr4input.find('button.submit_addr4').click(function(){
			var input = ui.addr4input.find('.addr4_input').val();
			if(input) goStep6(input);
			return false;
		});
		// 나머지주소(addr4) 입력후 '엔터'
		ui.addr4input.find('input.addr4_input').keypress(function(event){
			if(event.keyCode!=13) return;
			ui.addr4input.find('button.submit_addr4').click();
			return false;
		});

		// 재선택 버튼 클릭
		ui.viewer.find('button.reselect').click(function() {

			addr_first = '';
			switch (step) {
			case STEP_SELECT_ADDR2:
				goStep1();
				break;
			case STEP_INPUT_ADDR3:
			case STEP_SELECT_ADDR3:
				goStep2();
				break;
			case STEP_INPUT_ADDR4:
				goStep3();
				break;
			case STEP_COMPLETE:
				goStep1();
				break;
			default:
				break;
			}

		});
		
		var init = function() {
			// step 초기화
			step = 0;
			input_addr = ['','',''];
			// element 정리
			ui.startBtn.show();
			ui.viewer.hide();
			ui.addr1selector.hide();
			ui.addr2selector.hide();
			ui.addr3input.hide();
			ui.addr3selector.hide();
			ui.addr4input.hide();
		}
		
		var setViewer = function() {
			if(addr_first) ui.viewer.find('span.addr').text(addr_first+' ('+addr_zipcode+') '+addr_second);
			else ui.viewer.find('span.addr').text(input_addr.join(' '));
		}

		var goStep1 = function() {

			// step1: 광역시도 선택 단계
			step = STEP_SELECT_ADDR1;
			input_addr = ['','',''];
			addr_first = addr_second = addr_zipcode = '';

			// 광역시도 리스트 얻어와서 리스트에 넣기
			//http://cloud1.akasima1.cafe24.com/krzip/server.php?request=addr1
			ui.addr1selector.find('ul').empty();
			$.ajax({
				url : settings.hostname+'/server.php?request=addr1',
				dataType : 'jsonp',
				success : function(res)
				{
					if(res.result) {
						$.each(res.values, function(i){
							ui.addr1selector.find('ul').append($('<li><a href="#">'+this+'</a> </li>'));
						})
					}

				}
			});

			// element 정리
			ui.startBtn.hide();
			ui.viewer.slideUp();
			ui.addr1selector.slideDown();
			ui.addr2selector.slideUp();
			ui.addr3input.slideUp();
			ui.addr3selector.slideUp();
			ui.addr4input.hide();
		}

		var goStep2 = function() {

			// step2: 시/군/구 선택 단계
			step = STEP_SELECT_ADDR2;
			input_addr = [input_addr[0],'',''];

			// validate addr1
			if (arguments.length) input_addr[0] = arguments[0];
			
			// 시/군/구 리스트 얻어와서 리스트에 넣기
			//http://cloud1.akasima1.cafe24.com/krzip/server.php?request=addr2&search_addr1=xxx
			ui.addr2selector.find('ul').empty();
			$.ajax({
				url : settings.hostname+'/server.php?request=addr2&search_addr1='+input_addr[0],
				dataType : 'jsonp',
				success : function(res)
				{
					if(res.result) {
						$.each(res.values, function(i){
							ui.addr2selector.find('ul').append($('<li><a href="#">'+this+'</a> </li>'));
						})
					}

				}
			});
			
			setViewer();
			
			// element 정리
			ui.startBtn.hide();
			ui.viewer.slideDown();
			ui.addr1selector.slideUp();
			ui.addr2selector.slideDown();
			ui.addr3input.slideUp();
			ui.addr3selector.slideUp();
			ui.addr4input.hide();
		}

		var goStep3 = function() {

			// step3: 상세주소 입력 단계
			step = STEP_INPUT_ADDR3;
			input_addr[2] = '';

			// validate addr2
			if (arguments.length) input_addr[1] = arguments[0];
			setViewer();

			// element 정리
			ui.startBtn.hide();
			ui.viewer.slideDown();
			ui.addr1selector.slideUp();
			ui.addr2selector.slideUp();
			ui.addr3input.slideDown();
			ui.addr3selector.slideUp();
			ui.addr4input.hide();
		}

		var goStep4 = function() {

			// step4: 입력받은 상세주소를 검색해 상세주소 리스트를 출력하는 단계
			step = STEP_SELECT_ADDR3;

			// validate addr3
			if (arguments.length) input_addr[2] = arguments[0];
			ui.addr3selector.find('p span').text(input_addr[2]);


			// 시/군/구 리스트 얻어와서 리스트에 넣기
			//http://cloud1.akasima1.cafe24.com/krzip/server.php?search_word=xxx&search_addr1=xxx&search_addr2=xxxx&next=0
			if(search_next == 0) ui.addr3selector.find('table tbody').empty();
			var url = settings.hostname+'/server.php?search_word='+input_addr[2]+'&search_addr1='+input_addr[0]+'&search_addr2='+input_addr[1]+'&next='+search_next;
			console.log(url);
			$.ajax({
				url : url,
				dataType : 'jsonp',
				success : function(res)
				{
					if(res.result) {
						$.each(res.values.address, function(i){
							console.log(this);
							var bdname = this.bdname?' ('+this.bdname+')':'';
							ui.addr3selector.find('table tbody').append($('<tr><td>[도로명] <a href="#">'+this.addr1+' '+this.addr2_new + bdname +'</a><br/>[지번] ' + this.addr1+' '+this.addr2_old+'</td><td>'+this.zipcode+'</td></tr>'));
						});
						search_next = res.values.next;

						//더보기 감추기
						if(search_next == -1) ui.addr3selector.find('table tfoot').hide();
						else ui.addr3selector.find('table tfoot').show();
					}

				}
			});
			
			
			
			// element 정리
			ui.startBtn.hide();
			ui.viewer.slideDown();
			ui.addr1selector.slideUp();
			ui.addr2selector.slideUp();
			ui.addr3input.slideDown();
			ui.addr3selector.slideDown();
			ui.addr4input.hide();
		}

		var goStep5 = function() {
			
			// step5: 상세주소를 선택후, 나머지 주소를 입력하는 단계
			step = STEP_INPUT_ADDR4;

			// validate addr3
			if (arguments.length) {
				addr_first = arguments[0];
				addr_zipcode = arguments[1];
			}
			setViewer();
			
			// element 정리
			ui.startBtn.hide();
			ui.viewer.slideDown();
			ui.addr1selector.slideUp();
			ui.addr2selector.slideUp();
			ui.addr3input.slideUp();
			ui.addr3selector.slideUp();
			ui.addr4input.slideDown();
		}
		
		var goStep6 = function() {
			
			// step6: 나머지 주소를 입력받은 후, 완전한 주소를 출력하는 단계
			step = STEP_COMPLETE;

			// validate addr4
			if (arguments.length) addr_second = arguments[0];
			setViewer();
			
			// 새주소로 설정 변경
			ui.addr_first.val(addr_first+' ('+addr_zipcode+')');
			ui.addr_second.val(addr_second);
			
			// element 정리
			ui.oldAddress.val(ui.viewer.find('span.addr').text());
			ui.oldAddress.slideDown();
			ui.startBtn.slideDown();
			ui.viewer.slideUp();
			ui.addr1selector.slideUp();
			ui.addr2selector.slideUp();
			ui.addr3input.slideUp();
			ui.addr3selector.slideUp();
			ui.addr4input.slideUp();
		}
		
		init();

		return this;
	}

	$('.krZip').krZip();

})(jQuery);
