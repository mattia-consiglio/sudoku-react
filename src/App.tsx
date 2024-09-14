import type React from "react"
import { useCallback, useEffect, useState } from "react"
import SudokuGrid from "./components/SudokuGrid"
import { generateSudoku } from "./utils/sudoku"
import { HiOutlinePencil } from "react-icons/hi2"

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

	const handleNumberClick = (value: number) => {
		if (selectedCell) {
			if (noteMode) {
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
				if (value === grid[selectedCell.row][selectedCell.col]) {
					handleCellChange(selectedCell.row, selectedCell.col, 0)
				} else {
					handleCellChange(selectedCell.row, selectedCell.col, value)
				}
			}
		}
	}

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
						handleCellChange(row, col, Number.parseInt(e.key))
					}
					break
			}
		},
		[handleCellChange, selectedCell],
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
			/>

			<div className="flex items-center font-bold text-gray-600 pt-4">
				<button
					type="button"
					className="flex flex-col items-center relative"
					onClick={() => setNoteMode((prev) => !prev)}
				>
					<div
						className={`absolute -right-1/2 -translate-x-1/2 -top-2 font-semibold text-xs px-1 rounded ${noteMode ? "bg-green-500 text-white" : "bg-gray-300"}`}
					>
						{noteMode ? "ON" : "OFF"}
					</div>
					<HiOutlinePencil className="text-xl font-bold" />
					<span>Notes</span>
				</button>
			</div>
			<div className="flex space-x-2 mt-4">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
					const isSelected =
						selectedCell && grid[selectedCell.row][selectedCell.col] === number
					return (
						<button
							key={number}
							onClick={() => handleNumberClick(number)}
							className={`w-12 h-12 flex justify-center items-center text-gray-500 font-semibold rounded-full border-[3px] hover:border-gray-900 hover:text-gray-900 transition-all ${
								isSelected ? "border-blue-500" : "border-gray-400"
							}`}
							type="button"
						>
							{number}
						</button>
					)
				})}
			</div>
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
