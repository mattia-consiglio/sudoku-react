const isValid = (grid: number[][], row: number, col: number, num: number): boolean => {
	for (let x = 0; x < 9; x++) {
		if (grid[row][x] === num || grid[x][col] === num) return false
	}

	const startRow = Math.floor(row / 3) * 3
	const startCol = Math.floor(col / 3) * 3
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (grid[i + startRow][j + startCol] === num) return false
		}
	}

	return true
}

const solveSudoku = (grid: number[][]): boolean => {
	const findEmptyCell = (): [number, number] | null => {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				if (grid[row][col] === 0) {
					return [row, col]
				}
			}
		}
		return null
	}

	const emptyCell = findEmptyCell()
	if (!emptyCell) {
		return true
	}

	const [row, col] = emptyCell

	// Try numbers 1 through 9
	for (let num = 1; num <= 9; num++) {
		if (isValid(grid, row, col, num)) {
			grid[row][col] = num
			if (solveSudoku(grid)) {
				return true
			}
			grid[row][col] = 0
		}
	}

	return false
}

const fillDiagonalBox = (grid: number[][], row: number, col: number): void => {
	const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const num = nums.pop()
			if (num !== undefined) {
				grid[row + i][col + j] = num
			}
		}
	}
}
const shuffle = (arr: number[]): number[] => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

const removeNumbers = (grid: number[][], count: number): number[][] => {
	const puzzle = grid.map(row => [...row])
	let removed = 0
	while (removed < count) {
		const row = Math.floor(Math.random() * 9)
		const col = Math.floor(Math.random() * 9)
		if (puzzle[row][col] !== 0) {
			puzzle[row][col] = 0
			removed++
		}
	}
	return puzzle
}

export const generateSudoku = (): number[][] => {
	const grid = Array.from({ length: 9 }, () => Array(9).fill(0))
	for (let i = 0; i < 9; i += 3) {
		fillDiagonalBox(grid, i, i)
	}

	solveSudoku(grid)
	return removeNumbers(grid, 40)
}

/**
 * Checks if a given number can be placed in a specific cell based on Sudoku rules.
 * @param grid - The Sudoku grid.
 * @param row - The row index of the cell.
 * @param col - The column index of the cell.
 * @param num - The number to be placed.
 * @returns True if the number can be placed, otherwise false.
 */
export const canPlaceNumber = (
	grid: number[][],
	row: number,
	col: number,
	num: number
): boolean => {
	return isValid(grid, row, col, num)
}
