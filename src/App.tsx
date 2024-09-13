import type React from "react";
import { useState } from "react";
import SudokuGrid from "./components/SudokuGrid";
import { generateSudoku } from "./utils/sudoku";

const App: React.FC = () => {
	const [grid, setGrid] = useState<number[][]>(generateSudoku());
	const [generatedGrid, setGeneratedGrid] = useState<number[][]>(
		JSON.parse(JSON.stringify(grid)),
	);
	const [selectedCell, setSelectedCell] = useState<{
		row: number;
		col: number;
	} | null>(null);

	const handleCellChange = (row: number, col: number, value: number) => {
		const isGenerated = generatedGrid[row][col] !== 0;
		if (isGenerated) {
			return;
		}
		const newGrid = [...grid];
		if (value >= 1 && value <= 9) {
			newGrid[row][col] = value;
		} else {
			newGrid[row][col] = 0;
		}
		setGrid(newGrid);
	};

	const resetGrid = () => {
		const newGrid = generateSudoku();
		setGrid(newGrid);
		setGeneratedGrid(JSON.parse(JSON.stringify(newGrid)));
		setSelectedCell(null);
	};

	const handleNumberClick = (value: number) => {
		if (selectedCell) {
			handleCellChange(selectedCell.row, selectedCell.col, value);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-3xl font-bold mb-6">Sudoku Generator</h1>
			<SudokuGrid
				grid={grid}
				onCellChange={handleCellChange}
				selectedCell={selectedCell}
				setSelectedCell={setSelectedCell}
				generatedGrid={generatedGrid}
			/>
			<div className="flex space-x-2 mt-4">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
					const isSelected =
						selectedCell && grid[selectedCell.row][selectedCell.col] === number;
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
					);
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
	);
};

export default App;
