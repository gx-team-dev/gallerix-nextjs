import { CiSearch } from "react-icons/ci";


export default function SearchBox() {
  return (
    <div className="flex items-center border border-gray-400 rounded-sm w-64">
      <div className="pl-2 pr-1 text-gray-600">
        <CiSearch size={18} />
      </div>
      <input
        id="search"
        type="text"
        placeholder="Sök"
        className="w-full py-1 px-2 focus:outline-none border-l-1 border-gray-400"
      />
    </div>
  );
}