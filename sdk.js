(function () {
  function sdk(abc) {
    console.log(abc);

    return {
      version: '1.0.0'
    }

    
  }
  window.sdk = sdk;
})();