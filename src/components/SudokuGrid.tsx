import type React from "react";
import { useCallback, useEffect } from "react";

type SudokuGridProps = {
	grid: number[][];
	onCellChange: (row: number, col: number, value: number) => void;
	selectedCell: { row: number; col: number } | null;
	setSelectedCell: (cell: { row: number; col: number } | null) => void;
	generatedGrid: number[][]; // Aggiungi questa proprietà per tracciare i valori generati
};

const SudokuGrid: React.FC<SudokuGridProps> = ({
	grid,
	onCellChange,
	selectedCell,
	setSelectedCell,
	generatedGrid,
}) => {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!selectedCell) return;

			const { row, col } = selectedCell;

			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					if (row > 0) setSelectedCell({ row: row - 1, col });
					break;
				case "ArrowDown":
					e.preventDefault();
					if (row < 8) setSelectedCell({ row: row + 1, col });
					break;
				case "ArrowLeft":
					e.preventDefault();
					if (col > 0) setSelectedCell({ row, col: col - 1 });
					break;
				case "ArrowRight":
					e.preventDefault();
					if (col < 8) setSelectedCell({ row, col: col + 1 });
					break;
				case "Tab":
					e.preventDefault();
					if (e.shiftKey) {
						if (col > 0) setSelectedCell({ row, col: col - 1 });
						else if (row > 0) setSelectedCell({ row: row - 1, col: 8 });
					} else {
						if (col < 8) setSelectedCell({ row, col: col + 1 });
						else if (row < 8) setSelectedCell({ row: row + 1, col: 0 });
					}
					break;
				default:
					if (e.key >= "1" && e.key <= "9") {
						onCellChange(row, col, Number.parseInt(e.key));
					}
					break;
			}
		},
		[onCellChange, selectedCell, setSelectedCell],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<div className="grid grid-cols-9 mx-auto border-2 border-gray-400">
			{grid.map((row, rowIndex) =>
				row.map((cell, colIndex) => {
					// Applica i bordi specifici per suddividere in box 3x3
					const borderClasses = [
						rowIndex % 3 === 0 && "border-t-2", // Bordi superiori dei blocchi
						colIndex % 3 === 0 && "border-l-2", // Bordi sinistri dei blocchi
						(rowIndex + 1) % 3 === 0 && rowIndex !== 8 && "border-b-2", // Bordi inferiori dei blocchi
						(colIndex + 1) % 3 === 0 && colIndex !== 8 && "border-r-2", // Bordi destri dei blocchi
					]
						.filter(Boolean)
						.join(" ");

					const isSelected =
						selectedCell &&
						selectedCell.row === rowIndex &&
						selectedCell.col === colIndex;
					const isGenerated = generatedGrid[rowIndex][colIndex] !== 0;
					const divClasses = `w-10 h-10 flex items-center justify-center border border-gray-400 ${borderClasses} ${
						isSelected ? "outline outline-blue-500 z-10" : ""
					} ${isGenerated ? "bg-gray-200 font-bold" : ""}`;

					const handleInteraction = () => {
						console.log("clicked");
						setSelectedCell({ row: rowIndex, col: colIndex });
						// Rimuovi il focus dalla cella cliccata
						(document.activeElement as HTMLElement)?.blur();
					};

					return (
						<div
							key={`${rowIndex}-${
								// biome-ignore lint/suspicious/noArrayIndexKey: it is necessary
								colIndex
							}`}
							className={divClasses}
							onClick={handleInteraction}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === "  ") {
									handleInteraction();
								}
							}}
							tabIndex={isGenerated ? -1 : 0}
						>
							{cell !== 0 ? cell : ""}
						</div>
					);
				}),
			)}
		</div>
	);
};
export default SudokuGrid;
