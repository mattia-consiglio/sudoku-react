import React from "react"

interface NumbersInputProps {
	selectCellValue: number | null
	onNumberClick: (number: number) => void
}
function NumbersInput({ selectCellValue, onNumberClick }: NumbersInputProps) {
	return (
		<div className="flex space-x-1 mt-4">
			{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
				const isSelected = selectCellValue === number
				return (
					<button
						key={number}
						onClick={() => onNumberClick(number)}
						className={`p-2 flex justify-center items-center text-2xl text-gray-500 font-semibold rounded border-[3px] hover:border-gray-900 hover:text-gray-900 transition-all ${
							isSelected ? "border-blue-500 text-blue-500" : "border-gray-400"
						}`}
						type="button"
					>
						{number}
					</button>
				)
			})}
		</div>
	)
}

export default NumbersInput
