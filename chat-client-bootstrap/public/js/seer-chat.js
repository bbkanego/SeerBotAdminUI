import $ from 'jquery/dist/jquery.slim';
import config from './core/config-helper/config';

window.SEER_CHAT = function () {
    'use strict';

    const internalConf = {

    };

    const externalConfig = {

    };

    const initialize = function () {
        config.set(config.internal, internalConf);
    };


    return {
        'initialize': initialize
    }
}();

//init the chat on page load
window.SEER_CHAT.initialize();

// register with AMD
if (typeof define === 'function' && define.amd) {
    define('seer-chat', [], window.SEER_CHAT);
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SEER_CHAT;
}