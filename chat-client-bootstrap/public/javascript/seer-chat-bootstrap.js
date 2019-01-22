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
window.SEER_CHAT_BOOTSTRAP = (function(config) {
  const iframeCommonStyle = 'border-width: 0;border-style: none;min-width: 100%;';
  const iframeHiddenStyle = iframeCommonStyle + 'display: none';
  const iframeDisplayStyle = iframeCommonStyle + 'display: block';

  const internalConf = {
    iframe: undefined,
    iframeTargetOrigin: undefined,
    iframeHandle: undefined,
    receiverNonce: undefined,
    senderNonce: undefined,
  };

  let externalConf;

  const _initialize = function() {
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

    window.removeEventListener('message', handleMessage, false);
    window.addEventListener('message', handleMessage, false);

    setChatIframe();

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
    const targetDivObj = document.getElementById(externalConf.targetDivId);
    emptyNode(targetDivObj);

    const iframe = document.createElement('iframe');
    iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups';
    iframe.src = externalConf.sdkUrl;
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
    iframe.id = 'seerChatIdTypeIframe';

    targetDivObj.appendChild(iframe);

    // keep handle to the content window for posting events in and out of the iframe.
    internalConf.iframe = iframe;
    internalConf.iframeHandle = iframe.contentWindow;

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
      handleError('Chat cannot be inited since bootstrap config SEER_CHAT_config not defined');
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
      externalConf.loadCustomResourceBunle = true;
    }

    if (!externalConf.targetDivId) {
      return false;
    }

    internalConf.iframeTargetOrigin = externalConf.sdkUrl;

    return true;
  };

  const handleMessage = function(event) {
    if (internalConf.iframeTargetOrigin !== event.origin) {
      handleError('Error: recieved an iframe post message froma different post: ' + event.origin);
      return;
    }

    const payload = JSON.parse(event.data);
    const callback = payload.callback;
    const data = payload.data ? payload.data : {};

    if (
      payload.nonce ||
      (internalConf.receiverNonce && payload.nonce !== internalConf.receiverNonce)
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

    const configString = JSON.stringify(externalConf);
    event.source.postMessage(
        internalConf.senderNonce + ':setConfig:' + configString,
        internalConf.iframeTargetOrigin
    );
  };

  return {
    initialize: _initialize,
    hide: _hide,
    show: _show,
    destroy: _destroy,
  };
})();

// register module with AMD
if (typeof define === 'function' && define.amd) {
  define('seer-chat-bootstrap', [], window.SEER_CHAT_BOOTSTRAP);
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.SEER_CHAT_BOOTSTRAP;
}
