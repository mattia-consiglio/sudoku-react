import type React from "react"
import { useCallback, useEffect, useState } from "react"
import SudokuGrid from "./components/SudokuGrid"
import { canPlaceNumber, generateSudoku } from "./utils/sudoku"
import NumbersInput from "./components/NumbersInput"
import Controls from "./components/Controls"

const App: React.FC = () => {
	const [grid, setGrid] = useState<number[][]>(generateSudoku())
	const [generatedGrid, setGeneratedGrid] = useState<number[][]>(
		JSON.parse(JSON.stringify(grid)),
	)
	const [selectedCell, setSelectedCell] = useState<{
		row: number
		col: number
	} | null>(null)
	const [noteMode, setNoteMode] = useState<boolean>(false)
	const [notes, setNotes] = useState<{ [key: string]: number[] }>({})
	const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set())

	const handleCellChange = useCallback(
		(row: number, col: number, value: number) => {
			const isGenerated = generatedGrid[row][col] !== 0
			if (isGenerated) {
				return
			}
			const newGrid = [...grid]
			if (value >= 1 && value <= 9) {
				newGrid[row][col] = value
			} else {
				newGrid[row][col] = 0
			}
			setGrid(newGrid)
		},
		[generatedGrid, grid],
	)

	const resetGrid = () => {
		const newGrid = generateSudoku()
		setGrid(newGrid)
		setGeneratedGrid(JSON.parse(JSON.stringify(newGrid)))
		setSelectedCell(null)
		setNotes({})
	}

	const handleNumberClick = useCallback(
		(value: number) => {
			if (selectedCell) {
				if (noteMode) {
					if (!canPlaceNumber(grid, selectedCell.row, selectedCell.col, value))
						return
					const noteKey = `${selectedCell.row}-${selectedCell.col}`
					const noteValue = notes[noteKey] || []
					const updatedNoteValue = noteValue.includes(value)
						? noteValue.filter((val) => val !== value)
						: [...noteValue, value]
					setNotes({
						...notes,
						[noteKey]: updatedNoteValue,
					})
				} else {
					const numberCanBePlaced = canPlaceNumber(
						grid,
						selectedCell.row,
						selectedCell.col,
						value,
					)

					if (value === grid[selectedCell.row][selectedCell.col]) {
						if (!numberCanBePlaced) {
							invalidCells.delete(`${selectedCell.row}-${selectedCell.col}`)
						}
						handleCellChange(selectedCell.row, selectedCell.col, 0)
					} else {
						if (numberCanBePlaced) {
							invalidCells.delete(`${selectedCell.row}-${selectedCell.col}`)
						} else {
							invalidCells.add(`${selectedCell.row}-${selectedCell.col}`)
						}
						handleCellChange(selectedCell.row, selectedCell.col, value)
					}
					setInvalidCells(new Set(invalidCells))
				}
			}
		},
		[grid, handleCellChange, invalidCells, noteMode, notes, selectedCell],
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!selectedCell) return

			const { row, col } = selectedCell

			switch (e.key) {
				case "ArrowUp":
					e.preventDefault()
					if (row > 0) setSelectedCell({ row: row - 1, col })
					break
				case "ArrowDown":
					e.preventDefault()
					if (row < 8) setSelectedCell({ row: row + 1, col })
					break
				case "ArrowLeft":
					e.preventDefault()
					if (col > 0) setSelectedCell({ row, col: col - 1 })
					break
				case "ArrowRight":
					e.preventDefault()
					if (col < 8) setSelectedCell({ row, col: col + 1 })
					break
				case "Tab":
					e.preventDefault()
					if (e.shiftKey) {
						if (col > 0) setSelectedCell({ row, col: col - 1 })
						else if (row > 0) setSelectedCell({ row: row - 1, col: 8 })
					} else if (col < 8) setSelectedCell({ row, col: col + 1 })
					else if (row < 8) setSelectedCell({ row: row + 1, col: 0 })
					break
				default:
					if (e.key >= "1" && e.key <= "9") {
						handleNumberClick(Number.parseInt(e.key))
					}
					break
			}
		},
		[handleNumberClick, selectedCell],
	)

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [handleKeyDown])

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold mb-6">Sudoku Generator</h1>
			<SudokuGrid
				grid={grid}
				selectedCell={selectedCell}
				setSelectedCell={setSelectedCell}
				generatedGrid={generatedGrid}
				notes={notes}
				invalidCells={invalidCells}
			/>

			<Controls setNoteMode={setNoteMode} noteMode={noteMode} />
			<NumbersInput
				onNumberClick={handleNumberClick}
				selectCellValue={
					selectedCell ? grid[selectedCell.row][selectedCell.col] : null
				}
			/>
			<button
				onClick={resetGrid}
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
				type="button"
			>
				New Sudoku
			</button>
		</div>
	)
}

export default App
