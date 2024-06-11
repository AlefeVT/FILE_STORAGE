import { MdOutlineDocumentScanner } from "react-icons/md";

export function Logo() {
  return (
    <div className="bg-primary h-10 w-10 flex items-center justify-center rounded-md bg-gray-300 text-white">
      <MdOutlineDocumentScanner className="w-7 h-7 text-primary-foreground" />
    </div>
  )
}
