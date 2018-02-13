const {CompositeDisposable} = require('atom');

let captured = ''

module.exports = {

  subscriptions: null,

  activate(state) {

    // console.log('activate!');

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

  serialize() {
    return {
      // talonViewState: this.talonView.serialize()
    };
  },

  executeCommand() {
    // console.log('run!');
    // capture all keypresses
    captured = ''
    const resolver = atom.keymaps.addKeystrokeResolver(({event}) => {
      // console.log(captured, event, resolver);
      if(event.type === 'keyup') {
        if(event.key === 'Enter') {
          resolver.dispose()
          console.log({captured})
        } else {
        }
      } else {
        if(event.key !== 'Enter') {
          captured += event.key
        }
      }
      return 'cmd-shift-ctrl-alt-i' // ignore
    })
    // let editor
    // if (editor = atom.workspace.getActiveTextEditor()) {
      // editor.on('keydown', () => console.log(123))
      // let selection = editor.getSelectedText()
    //   let reversed = selection.split('').reverse().join('')
    //   editor.insertText(reversed)
    //}
  }
};
