import {Button, Pagination} from "@nextui-org/react";
import React from "react";

export default function PaginationComponent(totalPages: number, currentPage: number, setCurrentPage: (value: (((prevState: number) => number) | number)) => void) {
    return totalPages > 0 ? (
        <div className="py-2 px-2 flex justify-between items-center">
            <p className="text-small justify-items-start text-default-500">Page {currentPage} of {totalPages}</p>
            <Pagination
                loop
                showControls
                showShadow
                className="text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold"
                color="warning"
                radius="full"
                page={currentPage}
                total={totalPages}
                onChange={(page) => setCurrentPage(page)}
            />
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <Button
                    isDisabled={totalPages === 1}
                    onPress={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                    color="warning"
                    className="text-black-2 bg-meta-6"
                    size="sm"
                    variant="flat">
                    Previous
                </Button>
                <Button
                    isDisabled={totalPages === 1}
                    onPress={() => setCurrentPage((prev) => (prev < 10 ? prev + 1 : prev))}
                    size="sm"
                    className="text-black-2 bg-meta-6"
                    color="warning"
                    variant="flat">
                    Next
                </Button>
            </div>
        </div>
    ) : null;
}