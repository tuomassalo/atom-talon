// These command names are duplicated in atom.py
const commandNames = {
  DELETE_TO_BOL: 'b',
  DELETE_TO_EOL: 'e',
  SELECT_LINES: 's',
  FIND_NEXT: 'f',
  FIND_PREVIOUS: 'p',
  COPY_LINE: 'c',
  MOVE_LINE: 'm',
}

let editor
function getEditor() {
  editor = atom.workspace.getActiveTextEditor()
}

module.exports = {}

module.exports[commandNames.DELETE_TO_BOL] = () => {
  getEditor()
  if(editor.getSelectedText() !== '') {
    editor.delete()
  }
  editor.deleteToBeginningOfLine()
}
module.exports[commandNames.DELETE_TO_EOL] = () => {
  getEditor()
  if(editor.getSelectedText() !== '') {
    editor.delete()
  }
  editor.deleteToEndOfLine()
}
function find(needle, direction) {
  getEditor()
  const selection = editor.getSelections()[0]
  const scanner = direction === 'next' ? 'scanInBufferRange' : 'backwardsScanInBufferRange'
  const range = direction === 'next' ?
    [selection.getBufferRange().end, editor.getEofBufferPosition()] :
    [0, selection.getBufferRange().start]

  editor[scanner](
    new RegExp(needle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'),
    range,
    res => {
      if(res.match) {
        editor.setSelectedBufferRange([res.range.start, res.range.end])
        res.stop()
      }
    }
  )
}
module.exports[commandNames.FIND_NEXT] = () => {
  return needle => find(needle, 'next')
}
module.exports[commandNames.FIND_PREVIOUS] = () => {
  return needle => find(needle, 'previous')
}
module.exports[commandNames.COPY_LINE] = () => {
  return line => {
    getEditor()
    line = parseInt(line, 10) - 1
    const lineContent = editor.getBuffer().getLines()[line]
    if(lineContent) {
      editor.insertText(lineContent.trim() + '\n')
    }
  }
}
module.exports[commandNames.MOVE_LINE] = () => {
  return line => {
    getEditor()
    line = parseInt(line, 10) - 1
    const lineContent = editor.getBuffer().getLines()[line]
    if(lineContent) {
      const oldCursorPosition = editor.getCursorBufferPosition()
      editor.insertText(lineContent.trim() + '\n')
      if(oldCursorPosition.row < line) {
        line++
      }
      editor.setSelectedBufferRange([[line, 0], [line + 1, 0]])
      editor.delete()

      // keep the cursor where it was
      if(line > oldCursorPosition.row) {
        oldCursorPosition.row++
      }
      editor.setCursorBufferPosition(oldCursorPosition)
    }
  }
}
// convert '12345' to {from: 12, to: 345}
function calculateLineRange(lineRangeString) {
  const firstLength = Math.floor(lineRangeString.length / 2)
  return {
    from: +lineRangeString.substring(0, firstLength),
    to: +lineRangeString.substring(firstLength),
  }
}
module.exports[commandNames.SELECT_LINES] = () => {
  return lineRangeString => {
    getEditor()
    const lineRange = calculateLineRange(lineRangeString)
    editor.setSelectedBufferRange([[lineRange.from - 1, 0], [lineRange.to, 0]])
  }
}
