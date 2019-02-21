# atom-talon

## Atom package for integration with Talon (talonvoice.com)

# Usage

- Clone the repository under `~/.atom/packages/` and restart Atom: `git clone https://github.com/tuomassalo/atom-talon.git ~/.atom/packages/atom-talon`
- Copy or symlink `atom.py` to `~/.talon/user/`

See `atom.py` for supported commands.

# Development

Most of the nontrivial commands are implemented as follows:

- `atom.py` sends `ctrl-cmd-shift-alt-t` to Atom
- if the command needs parameters, the Atom extension captures all keyboard input until `enter` is pressed
- `atom.py` sends the parameters and `enter` to Atom

This approach was chosen (over an out-of-band communication) to prevent out-of-order command execution in Atom.

To add a command:

- add it to COMMANDS in both `commands.js` and `atom.py`
  - for now, command instructions are single-letter
- write the implementation in `commands.js`
  - if the command needs parameters such as line numbers or search words, it must return a callback function. The callback is called with the parameter string when `enter` has been pressed.
  - if the command doesn't need parameters, it must not return function.
- add something to `atom.py` that triggers the command.
  - please see https://github.com/talonvoice/talon/issues/5.
- make a pull request

NB: Talon sends the command and parameters to Atom one keypress at a time. For performance reasons, keep the parameters string short.
