import { Search } from "lucide-react";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchInput = () => {
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e) => {
    const query = e.target.value;
    setValue(query);

    if (query.trim()) {
      setSearchParams({ query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="relative flex items-center">
      <Search className="text-slate-600 absolute left-3 top-3 h-4 w-4" />
      <input
        type="text"
        value={value}
        onChange={handleSearch}
        className="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 pl-9 font-sans text-sm font-normal text-blue-gray-700 outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border focus:border-gray-900 focus:outline-none disabled:border-0 disabled:bg-blue-gray-50 md:w-[400px]"
        placeholder="Chercher une formation"
      />
    </div>
  );
};

export default SearchInput;
