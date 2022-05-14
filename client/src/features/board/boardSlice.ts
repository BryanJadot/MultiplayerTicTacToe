import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {
	User,
	Turn,
	Board,
	BoardPosition,
	WinState,
	WinningSquares
} from "../../common/boardTypes";

interface BoardState {
	playerX: User
	playerO: User
	currentTurn: Turn
	board: Board,
	winState: WinState,
	winningSquares?: WinningSquares
}

const initialState = {
	playerX: {name:"Bryan", userId:1},
	playerO: {name: "Tina", userId:2},
	currentTurn: "X",
	board: [[null, null, null], [null, null, null], [null, null, null]],
	winState: WinState.IN_PROGRESS,
} as BoardState;

const possibleWins: WinningSquares[] = [
	[{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }],
	[{ r: 0, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 2 }],
	[{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }],
	[{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }],
	[{ r: 0, c: 2 }, { r: 1, c: 1 }, { r: 2, c: 0 }],
	[{ r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }],
	[{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
	[{ r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }]
];

const checkForWin = (board: Board, currentTurn: Turn): {
	winState: WinState, winningSquares?: WinningSquares
} => {
	for (const winningSquares of possibleWins) {
		if (winningSquares.every(
			(boardPosition) => board[boardPosition.r][boardPosition.c] === currentTurn
		)) {
			console.log(winningSquares);
			return {
				winState: (currentTurn === "X") ? WinState.X_WINS : WinState.O_WINS,
				winningSquares
			};
		}
	}

	const isAHungGame = board.every((row) => row.every((square) => square !== null));
	if (isAHungGame) {
		return {
			winState: WinState.HUNG_GAME
		};
	}

	return {
		winState: WinState.IN_PROGRESS
	};
};

const boardSlice = createSlice({
	name: "board",
	initialState,
	reducers: {
		makeMove: (state, action: PayloadAction<BoardPosition>) => {
			state.board[action.payload.r][action.payload.c] = state.currentTurn;
			const winCheck = checkForWin(state.board, state.currentTurn);
			state.winState = winCheck.winState;
			if (winCheck.winningSquares) {
				state.winningSquares = winCheck.winningSquares;
			}

			state.currentTurn = (state.currentTurn === "X") ? "O" : "X";
		},
		restartGame: (state) => {
			state.playerX = initialState.playerX;
			state.playerO = initialState.playerO;
			state.currentTurn = initialState.currentTurn;
			state.board = initialState.board;
			state.winState = initialState.winState;
			state.winningSquares = initialState.winningSquares;
		}
	}
});

export const { makeMove, restartGame } = boardSlice.actions;
export const selectCurrentTurn = (state: RootState) => state.board.currentTurn;
export const selectBoard = (state: RootState) => state.board.board;
export const selectWinState = (state: RootState) => state.board.winState;
export const selectWinningSquares = (state: RootState) => state.board.winningSquares;

export default boardSlice.reducer;