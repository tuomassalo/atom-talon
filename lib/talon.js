const {CompositeDisposable} = require('atom');
const commands = require('./commands')

let captured = ''
let commandFunction

module.exports = {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    // Register command that captures this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'talon:execute-command': () => this.executeCommand(),
      'talon:ignore': () => console.log('ignore'),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  executeCommand() {
    // When the hotkey is pressed, start capturing all keypresses.
    // The first keypress indicates the command function.
    // If the function returns a function, then capture until enter is pressed.
    // Otherwise, it's a command that doesn't require any parameters.

      const resolver = atom.keymaps.addKeystrokeResolver(({event}) => {

      function endCapture() {
        resolver.dispose()
        commandFunction = null
      }

      // console.log(captured, event, resolver);
      try {
        if(event.type === 'keyup') {
          if(event.key === 'Enter') {
            console.log('calling', {captured, commandFunction})
            commandFunction(captured)
            endCapture()
          }
        } else {
          if(event.key !== 'Enter') {
            if(commandFunction) {
              captured += event.key
            } else {
              if(typeof commands[event.key] !== 'function') {
                console.warn(`atom-talon: unknown command '${event.key}'`);
                endCapture()
              }
              commandFunction = commands[event.key]()
              captured = ''
              if(typeof commandFunction !== 'function') {
                endCapture()
              }
            }
          }
        }
      } catch(e) {
        endCapture()
        throw e
      }
      return 'cmd-shift-ctrl-alt-i' // ignore
    })
  }
};
