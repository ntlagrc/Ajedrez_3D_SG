export function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function isEmpty(boardState, r, c) {
  return inBounds(r, c) && boardState[r][c] === null;
}

export function isAlly(boardState, r, c, myColor) {
  return inBounds(r, c)
      && boardState[r][c] !== null
      && boardState[r][c].color === myColor;
}

export function isEnemy(boardState, r, c, myColor) {
  return inBounds(r, c)
      && boardState[r][c] !== null
      && boardState[r][c].color !== myColor;
}
