import type React from "react"

type SudokuGridProps = {
	grid: number[][]
	selectedCell: { row: number; col: number } | null
	setSelectedCell: (cell: { row: number; col: number } | null) => void
	generatedGrid: number[][] // Aggiungi questa proprietà per tracciare i valori generati
	notes: { [key: string]: number[] }
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
	grid,
	selectedCell,
	setSelectedCell,
	generatedGrid,
	notes,
}) => {
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
						.join(" ")

					const isSelected =
						selectedCell &&
						selectedCell.row === rowIndex &&
						selectedCell.col === colIndex
					const isGenerated = generatedGrid[rowIndex][colIndex] !== 0
					const divClasses = `relative w-10 h-10 flex items-center justify-center border border-gray-400  text-3xl ${borderClasses} ${
						isSelected ? "outline outline-blue-500 z-10" : ""
					} ${isGenerated ? "" : "text-blue-500"}`

					const handleInteraction = () => {
						setSelectedCell({ row: rowIndex, col: colIndex })
						// Rimuovi il focus dalla cella cliccata
						;(document.activeElement as HTMLElement)?.blur()
					}

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
									handleInteraction()
								}
							}}
							tabIndex={isGenerated ? -1 : 0}
						>
							{cell !== 0 ? cell : ""}

							{notes[`${rowIndex}-${colIndex}`] && cell === 0 && (
								<div className="absolute top-0 left-0 w-full h-full grid grid-cols-3 grid-rows-3 justify-center items-center text-gray-400 p-1 gap-1">
									{notes[`${rowIndex}-${colIndex}`].map((note) => {
										let rowStart = Math.floor(note / 3)
										let colStart = note % 3
										if (colStart === 0) {
											rowStart -= 1
										}
										if (rowStart >= 1) {
											rowStart += 1
										}
										if (rowStart === 0) {
											rowStart = 1
										}

										if (colStart === 0) {
											colStart = 3
										}

										return (
											<div
												key={`note-${rowIndex}-${colIndex}-${note}`}
												style={{
													gridRowStart: rowStart,
													gridColumnStart: colStart,
												}}
												className="text-xs text-center"
											>
												{note}
											</div>
										)
									})}
								</div>
							)}
						</div>
					)
				}),
			)}
		</div>
	)
}
export default SudokuGrid
