<?php
/* Copyright (C) NAVER <http://www.navercorp.com> */

    /**
     * @class  krzip
     * @author NAVER (developers@xpressengine.com)
     * @brief Super class of krzip, which is a zip code search module
     **/

    class krzip extends ModuleObject {

        var $hostname = 'kr.zip.zeroboard.com';
        var $port = 80;
        var $query = 'krzip/server.php';
        
        /**
         * @brief Implement if additional tasks are necessary when installing
         **/
        function moduleInstall() {
            return new Object();
        }

        /**
         * @brief a method to check if successfully installed
         **/
        function checkUpdate() {
            return false;
        }

        /**
         * @brief Execute update
         **/
        function moduleUpdate() {
            return new Object();
        }

        /**
         * @brief Re-generate the cache file
         **/
        function recompileCache() {
        }
    }
?>
