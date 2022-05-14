import React from 'react';
import classNames from 'classnames';
import {
  Mark,
  Turn,
  WinningSquares,
  WinState,
  BoardPosition,
} from '../../common/boardTypes';
import styles from './board.module.scss';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  makeMove,
  restartGame,
  selectCurrentTurn,
  selectBoard,
  selectWinState,
  selectWinningSquares,
} from './boardSlice';

function Square({
  mark,
  boardPosition,
  winState,
  winningSquares,
}: {
  mark: Mark;
  boardPosition: BoardPosition;
  winState: WinState;
  winningSquares?: WinningSquares;
}) {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectBoard);

  const onClickSquare = () => {
    if (
      board[boardPosition.r][boardPosition.c] === null &&
      winState === WinState.IN_PROGRESS
    ) {
      dispatch(makeMove(boardPosition));
    }
  };

  const isWinningSquare = winningSquares?.some(
    (winningBoardPosition) =>
      winningBoardPosition.c === boardPosition.c &&
      winningBoardPosition.r === boardPosition.r
  );

  return (
    <button
      type="button"
      className={classNames(styles.square, {
        [styles.winningSquare]: isWinningSquare,
      })}
      onClick={onClickSquare}
    >
      {mark}
    </button>
  );
}

function Board() {
  const getGameStatusText = (currentTurn: Turn, winState: WinState) => {
    switch (winState) {
      case WinState.X_WINS: {
        return (
          <div className={classNames(styles.gameStatus, styles.gameOver)}>
            X wins!
          </div>
        );
      }
      case WinState.O_WINS: {
        return (
          <div className={classNames(styles.gameStatus, styles.gameOver)}>
            O wins!
          </div>
        );
      }
      case WinState.HUNG_GAME: {
        return (
          <div className={classNames(styles.gameStatus, styles.gameOver)}>
            Hung game!
          </div>
        );
      }
      case WinState.IN_PROGRESS: {
        return <div className={styles.gameStatus}>Turn: {currentTurn}</div>;
      }
      default: {
        throw new Error('Invalid WinState');
      }
    }
  };
  const winState = useAppSelector(selectWinState);
  const gameStatusText = getGameStatusText(
    useAppSelector(selectCurrentTurn),
    winState
  );

  const board = useAppSelector(selectBoard);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.restartButton}
          onClick={() => dispatch(restartGame())}
        >
          Restart game
        </button>
        {gameStatusText}
      </div>
      <div className={styles.board}>
        {board.map((row, r) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <div className={styles.row} key={r}>
            {row.map((mark, c) => (
              <Square
                /* eslint-disable-next-line react/no-array-index-key */
                key={c}
                mark={mark}
                boardPosition={{ r, c }}
                winState={winState}
                winningSquares={useAppSelector(selectWinningSquares)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
