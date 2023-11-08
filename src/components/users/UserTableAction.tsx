import React from 'react';
import {Input} from "@nextui-org/react";
import {SearchIcon} from "@nextui-org/shared-icons";

export default function UserTableAction({ setSearchQuery }) {
    const handleSearchChange = (event) => {
        const newSearchQuery = event.target.value;
        if (newSearchQuery > 4){
            console.log("search query", newSearchQuery)
            setSearchQuery(newSearchQuery);
        }
    }
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap m-2 md:mb-0 gap-4">
            <Input type="text"
                   placeholder="Search for users"
                   id="table-search-users"
                   startContent={
                       <SearchIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                   }
                   className="w-80"
                   onChange={handleSearchChange}
            />
        </div>
    )
}