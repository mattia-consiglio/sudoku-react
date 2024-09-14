import type React from "react"
import { HiOutlinePencil } from "react-icons/hi2"
interface ControlsProps {
	noteMode: boolean
	setNoteMode: React.Dispatch<React.SetStateAction<boolean>>
}

function Controls({ noteMode, setNoteMode }: ControlsProps) {
	return (
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
	)
}

export default Controls
