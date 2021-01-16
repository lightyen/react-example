import { useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import "twin.macro"

interface FileSystemEntry {
	filesystem: unknown
	fullpath: string
	isDirectory: boolean
	isFile: boolean
	name: string
	/** Returns a File object which can be used to read data from the file represented by the directory entry. */
	file(successCallback: (file: File) => void): void
	/** Returns a FileSystemDirectoryReader object which can be used to read the entries in the directory. */
	createReader(): FileSystemDirectoryReader
}

interface FileSystemDirectoryReader {
	readEntries(successCallback: (entries: FileSystemEntry[]) => void, errCallback?: (e: unknown) => void): void
	entries(): Promise<FileSystemEntry[]>
}

class DirectoryReader {
	r: FileSystemDirectoryReader
	constructor(entry: FileSystemEntry) {
		this.r = entry.createReader()
	}
	entries() {
		return new Promise<FileSystemEntry[]>((res, reject) => {
			this.r.readEntries(
				entries => res(entries),
				err => reject(err),
			)
		})
	}
}

async function traverse(item: FileSystemEntry, path = "") {
	if (item.isFile) {
		item.file(file => {
			console.log(path + "/" + file.name)
		})
	} else if (item.isDirectory) {
		const reader = new DirectoryReader(item)
		try {
			// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
			for (;;) {
				const e = await reader.entries()
				for (const f of e) {
					traverse(f, path + "/" + item.name)
				}
			}
		} catch (err) {
			console.error(err)
		}
	}
}

async function handleSubmit(e: React.DragEvent) {
	const items = e.dataTransfer.items
	for (let i = 0; i < items.length; i++) {
		const item: FileSystemEntry = items[i].webkitGetAsEntry()
		if (item) {
			await traverse(item)
		}
	}
}

const FileUploader = () => {
	const inputRef = useRef<HTMLInputElement>()
	const uuid = useRef(uuidv4())
	useEffect(() => {
		const el = inputRef.current
		el.setAttribute("webkitdirectory", "")
		el.setAttribute("allowdirs", "")
		el.setAttribute("directory", "")
	}, [])
	return (
		<div tw="flex">
			<input
				ref={inputRef}
				type="file"
				tw="hidden"
				id={uuid.current}
				multiple
				onChange={e => {
					const files = e.target.files
					for (let i = 0; i < files.length; i++) {
						console.log(files[i]["webkitRelativePath"])
					}
				}}
			/>
			<label
				tw="bg-gray-300"
				htmlFor={uuid.current}
				css={{ width: 500, height: 320 }}
				onDragOver={e => e.preventDefault()}
				onDrop={e => {
					e.preventDefault()
					handleSubmit(e)
				}}
			></label>
		</div>
	)
}

export default FileUploader
