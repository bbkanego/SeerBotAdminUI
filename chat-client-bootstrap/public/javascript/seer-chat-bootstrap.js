/**
 * This JS is the entry point to the chatbot. The client will include this JS on there website with
 * configuration params.
 * The below implements the "Self Executing" JS
 * paradigm per: http://markdalgleish.com/2011/03/self-executing-anonymous-functions/
 * https://stackoverflow.com/questions/14322708/what-is-self-executing-anonymous-function-or-what-is-this-code-doing
 *
 * Note that this JS will be loaded by the client on there website an thus
 * we will use plain old JS here. No jquery etc
 * will be used here.
 */
window.SEER_CHAT_SETUP = (function() {
  const iframeCommonStyle = 'border-width: 0;border-style: none;min-width: 100%;';
  const iframeHiddenStyle = iframeCommonStyle + 'display: none';
  const iframeDisplayStyle = iframeCommonStyle + 'display: block';

  const internalConf = {
    iframe: undefined,
    origin: undefined,
    iframeTargetOrigin: undefined,
    iframeHandle: undefined,
    receiverNonce: undefined,
    senderNonce: undefined,
    targetDivId: 'seerChat-iframe-target',
    chatAPIUrl: 'https://gab.seersense.com/chatbot/api/chats',
    chatBotUrl: 'https://gabstatic.seersense.com',
    botId: undefined,
    chatWindowHeading: 'No Title. Provide Title',
    chatButtonLabel: 'Talk To Us!',
  };

  let externalConf;

  const _initialize = function(config) {
    if (config) {
      externalConf = config;
    } else {
      if (!getConfig()) {
        return false;
      }
    }

    if (!validateConfig()) {
      return false;
    }

    /**
    * Listen to messages coming in from the Iframe and handle them.
    */
    window.removeEventListener('message', handleMessage, false);
    window.addEventListener('message', handleMessage, false);

    if (externalConf.targetDivId) {
      internalConf.targetDivId = externalConf.targetDivId;
    }
    if (externalConf.chatAPIUrl) {
      internalConf.chatAPIUrl = externalConf.chatAPIUrl;
    }
    if (externalConf.chatBotUrl) {
      internalConf.chatBotUrl = externalConf.chatBotUrl;
    }

    internalConf.botId = externalConf.botId;
    internalConf.chatWindowHeading = externalConf.chatWindowHeading;
    internalConf.chatButtonLabel = externalConf.chatButtonLabel;
    internalConf.iframeTargetOrigin = internalConf.chatBotUrl;
    internalConf.origin = window.location.origin;

    addChatDivStyling();

    setChatIframe();

    console.log('Seer Chat IFrame configuration with config: ' + internalConf);

    return true;
  };

  const _hide = function() {
    internalConf.iframe.setAttribute('style', iframeHiddenStyle);
  };

  const _show = function() {
    internalConf.iframe.setAttribute('style', iframeDisplayStyle);
  };

  const _destroy = function() {
    const payload = {};
    const payloadString = JSON.stringify(payload);

    internalConf.iframeHandle.postMessage(
        internalConf.senderNonce + ':destroy:' + payloadString,
        internalConf.iframeTargetOrigin
    );
  };

  const setChatIframe = function() {
    const targetDivObj = document.getElementById(internalConf.targetDivId);
    emptyNode(targetDivObj);

    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-top-navigation-by-user-activation ' +
        'allow-top-navigation allow-same-origin allow-scripts allow-forms allow-popups';
    iframe.src = internalConf.chatBotUrl + '/index.html?rand=' + (new Date()).getTime();
    iframe.name = '\'' + (new Date()).getTime() + '\'';
    if (externalConf.collapsed) {
      iframe.setAttribute('style', iframeHiddenStyle);
    } else {
      iframe.setAttribute('style', iframeDisplayStyle);
    }
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    // iframe will show in the div.It will take the width of the div
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.title = 'Seer Chat';
    iframe.id = 'seerChatIdTypeIframe_' + (new Date()).getTime();

    targetDivObj.appendChild(iframe);

    // keep handle to the content window for posting events in and out of the iframe.
    internalConf.iframe = iframe;
    internalConf.iframeHandle = iframe.contentWindow;

    /**
     * As soon as the Iframe and its content loads, trigger the
     * sendInitialize function.
     */
    iframe.removeEventListener('load', function() {
      sendInitialize();
    });
    iframe.addEventListener('load', function() {
      sendInitialize();
    });
  };

  const sendInitialize = function() {
    internalConf.receiverNonce = uuid();

    /**
     * This sends an "initialize" message for the JS in the iframe to
     * initialize
     */
    internalConf.iframeHandle.postMessage(
        ':initialize:' + internalConf.receiverNonce,
        internalConf.iframeTargetOrigin
    );
  };

  const uuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const emptyNode = function(node) {
    while (node.hasChildNodes()) {
      node.removeChild(node.firstChild);
    }
  };

  const getConfig = function() {
    if (!window.SEER_CHAT_config) {
      handleError('Chat cannot be initialized since bootstrap config SEER_CHAT_config not defined');
    }
    externalConf = window.SEER_CHAT_config;
    return true;
  };

  const handleError = function(errorStr) {
    if (externalConf.errorHandler) {
      externalConf.errorHandler(errorStr);
    } else {
      console.log(errorStr);
    }
  };

  const validateConfig = function() {
    if (externalConf.brandIdentifier) {
      externalConf.loadCustomCSS = true;
      externalConf.loadCustomResourceBundle = true;
    }

    if (!externalConf.botId) {
      console.error('BotId has not been defined');
      return false;
    }

    return true;
  };

  const handleMessage = function(event) {
    if (internalConf.iframeTargetOrigin !== event.origin) {
      handleError(
          'Error: received an iframe post ' + 'message from a different origin: ' + event.origin
      );
      return;
    }

    const payload = JSON.parse(event.data);
    const callback = payload.callback;
    const data = payload.data ? payload.data : {};

    if (
      !payload.nonce ||
                !internalConf.receiverNonce ||
                payload.nonce !== internalConf.receiverNonce
    ) {
      handleError('Received an iframe post message with an invalid nonce');
      return;
    }

    const messageParts = callback.split(':');
    switch (messageParts[0]) {
      case 'getConfig':
        sendConfig(event, payload.data.nonce);
        break;
      case 'callback':
        const callbackContext = messageParts[1];
        const callbackState = messageParts[2];
        if (
          externalConf.callbacks &&
                        externalConf.callbacks[callbackContext] &&
                        externalConf.callbacks[callbackContext][callbackState]
        ) {
          try {
            externalConf.callbacks[callbackContext][callbackState](data);
          } catch (err) {
            handleError('Error thrown by callback function: ' + err);
          }
        }
        break;
      default:
        break;
    }
  };

  const sendConfig = function(event, nonce) {
    if (!internalConf.senderNonce) {
      internalConf.senderNonce = nonce;
    }

    const internalConfTemp = {
      iframeTargetOrigin: internalConf.iframeTargetOrigin,
      targetDivId: internalConf.targetDivId,
      chatAPIUrl: internalConf.chatAPIUrl,
      chatBotUrl: internalConf.chatBotUrl,
      botId: internalConf.botId,
      chatButtonLabel: internalConf.chatButtonLabel,
      chatWindowHeading: internalConf.chatWindowHeading,
      origin: internalConf.origin,
    };

    const configString = JSON.stringify(internalConfTemp);
    event.source.postMessage(
        internalConf.senderNonce + ':setConfig:' + configString,
        internalConf.iframeTargetOrigin
    );
  };

  /* const setStyle = function(cssRules, aSelector, aStyle) {
    for (var i = 0; i < cssRules.length; i++) {
      if (cssRules[i].selectorText
      && cssRules[i].selectorText.toLowerCase() === aSelector.toLowerCase()) {
        cssRules[i].style.cssText = aStyle;
        return true;
      }
    }
    return false;
  };*/

  const addChatDivStyling = function() {
    if (document.getElementsByTagName('head').length === 0) return;

    // add the container div first
    let chatDiv = document.getElementById('seerChat-iframe-target');
    if (!chatDiv) {
      chatDiv = document.createElement('div');
      chatDiv.id = 'seerChat-iframe-target';
      chatDiv.className = 'chat_window';
      document.getElementsByTagName('body')[0].appendChild(chatDiv);
    }

    // then add the class/styles required for showing the chat client.
    const styleElementsArray = document.getElementsByTagName('style');
    let targetStyleElement;
    if (styleElementsArray.length === 0) {
      targetStyleElement = document.createElement('style');
      targetStyleElement.type = 'text/css';
      // style.innerHTML = '.cssClass { color: #F00; }';
      document.getElementsByTagName('head')[0].appendChild(targetStyleElement);
    } else {
      targetStyleElement = styleElementsArray[0];
    }
    targetStyleElement.innerHTML = targetStyleElement.innerHTML + ' .chat_window {\n' +
                '        position: fixed;\n' +
                '        bottom: 10px;\n' +
                '        right: 10px;\n' +
                '        width: 500px;\n' +
                '        max-width: 800px;\n' +
                '        min-width: 300px;\n' +
                '        height: 500px;\n' +
                '        overflow: hidden;\n' +
                '        z-index: 40000;\n' +
                '        background-color: transparent;\n' +
                '      }' + ' @media (max-width: 768px){\n' +
                '        #seerChat-iframe-target {\n' +
                '          width:80%;\n' +
                '          height:60vh;\n' +
                '        }\n' +
                '      }\n' +
                '\n ' +
                '      @media (max-width: 992px){\n' +
                '        #seerChat-iframe-target{\n' +
                '          width:80%;\n' +
                '          height:60vh;\n' +
                '        }\n' +
                '      }';
  };

  /* const createCSSSelector = function(selector, style) {
    if (!document.styleSheets) return;
    if (document.getElementsByTagName('head').length === 0) return;

    var styleSheet; var mediaType;

    if (document.styleSheets.length > 0) {
      for (let i1 = 0, l1 = document.styleSheets.length; i1 < l1; i1++) {
        if (document.styleSheets[i1].disabled) {
          continue;
        }
        var media = document.styleSheets[i1].media;
        mediaType = typeof media;

        if (mediaType === 'string') {
          if (media === '' || (media.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i1];
          }
        } else if (mediaType === 'object') {
          if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i1];
          }
        }

        if (typeof styleSheet !== 'undefined') {
          break;
        }
      }
    }

    if (typeof styleSheet === 'undefined') {
      var styleSheetElement = document.createElement('style');
      styleSheetElement.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

      for (let i2 = 0; i2 < document.styleSheets.length; i2++) {
        if (document.styleSheets[i2].disabled) {
          continue;
        }
        styleSheet = document.styleSheets[i2];
      }

      mediaType = typeof styleSheet.media;
    }

    if (mediaType === 'string') {
      for (let i = 0, l = styleSheet.rules.length; i < l; i++) {
        if (styleSheet.rules[i].selectorText
        && styleSheet.rules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
          styleSheet.rules[i].style.cssText = style;
          return;
        }
      }
      styleSheet.addRule(selector, style);
    } else if (mediaType === 'object') {
      var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
      for (var i = 0; i < styleSheetLength; i++) {
        if (styleSheet.cssRules[i].selectorText &&
        styleSheet.cssRules[i].selectorText.toLowerCase() === selector.toLowerCase()) {
          styleSheet.cssRules[i].style.cssText = style;
          return;
        }
      }
      styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
    }
  };*/

  return {
    initialize: _initialize,
    hide: _hide,
    show: _show,
    destroy: _destroy,
  };
}
)();

// register module with AMD
if (typeof define === 'function' && define.amd) {
  define('seer-chat-bootstrap', [], window.SEER_CHAT_BOOTSTRAP);
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.SEER_CHAT_BOOTSTRAP;
}
