

module.exports = {
  load() {
    // execute when package loaded
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    open() {
      // open entry panel registered in package.json
      Editor.Panel.open('statemachine');
    },
    'say-hello': function () {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('statemachine', 'statemachine:hello');
    },
    clicked() {
      Editor.log('Button clicked!');
    },
  },
};
