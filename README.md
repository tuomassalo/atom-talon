# atom-talon

## Atom package for integration with Talon (talonvoice.com)

# Usage

- Clone the repository under `~/.atom/packages/` and restart Atom

- Copy or symlink `atom.py` to `~/.talon/user/`

  - Please see https://github.com/talonvoice/talon/issues/5 if symlinking

See `atom.py` for supported commands.

# Development

Most of the nontrivial commands are implemented as follows:

- `atom.py` sends `ctrl-cmd-shift-alt-t` to Atom
- if the command needs parameters, the Atom extension captures all keyboard input until `enter` is pressed
- `atom.py` sends the parameters and `enter` to Atom

