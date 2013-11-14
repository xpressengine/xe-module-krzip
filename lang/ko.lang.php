<?php
    /**
     * @file   modules/krzip/lang/ko.lang.php
     * @author NHN (developers@xpressengine.com)
     * @brief  한국어 언어팩 (기본적인 내용만 수록)
     **/

    // 일반 단어들
    $lang->krzip = '한국 우편번호';
    $lang->krzip_server_hostname = '우편번호 검사 서버의 이름';
    $lang->krzip_server_port = '우편번호 검사 서버 포트';

    $lang->zipcode = '우편번호';
    $lang->street_house_address = '도로명/지번 주소';
    
    // 설명문
    $lang->about_krzip_server_hostname = '우편번호를 검사하여 결과 목록을 가져올 서버의 도메인을 입력해주세요.';
    $lang->about_krzip_server_port = '우편번호를 검사서버의 포트 번호를 입력해주세요.';
    $lang->about_krzip_server_query = '우편번호를 검사서버에 요청할 query url을 입력해 주세요.';
    $lang->about_kr_address_detail = '검색방법<br>1. 동/리와 지번을 검색하세요 예) 영평동 2181<br>2. 건물명으로 검색하세요 예) XE빌딩<br>3. 도로명으로 검색하세요 예) 첨단로 242<br>※ 동/리명만으로는 검색되지 않습니다. 예)이수동(X)';
    
    // 메시지
    $lang->msg_not_exists_addr = '검색하려는 대상이 없습니다.';
    $lang->msg_fail_to_socket_open = '우편번호 검색 대상 서버 접속에 실패하였습니다.';
    
    $lang->cmd_reselect = '재선택';
    $lang->cmd_kr_address_modify = '주소변경';
    $lang->cmd_kr_address_input = '주소입력';
    $lang->cmd_kr_address_detail = '상세주소를 입력하세요.';
    $lang->cmd_select_detail_address = '의 검색결과입니다. 아래의 주소중에서 해당되는 주소를 선택하세요.';
    $lang->cmd_kr_address_addr1 = '광역시도를 선택하세요.';
    $lang->cmd_kr_address_addr2 = '시/군/구를 선택하세요.';
    $lang->cmd_kr_address_etc = '나머지주소를 입력하세요.';
    
?>
