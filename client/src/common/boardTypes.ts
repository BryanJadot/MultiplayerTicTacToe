type Turn = "X" | "O";
type Mark = Turn | null;
type Board = [[Mark, Mark, Mark], [Mark, Mark, Mark], [Mark, Mark, Mark]];

type BoardPosition = {
    c: number,
    r: number
}

type User = {
    name: string,
    userId: number
}

type WinningSquares = [BoardPosition, BoardPosition, BoardPosition];

enum WinState {
    X_WINS,
    O_WINS,
    HUNG_GAME,
    IN_PROGRESS
}

export { Turn, Mark, Board, BoardPosition, User, WinState, WinningSquares };