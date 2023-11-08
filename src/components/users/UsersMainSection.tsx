import {UserQueryParameters} from "@/boundary/parameters/userQueryParameters";
import {getUsers} from "@/lib/users/userService";
import {toast} from "react-toastify";
import {PagedResponse} from "@/boundary/paging/paging";
import {UserResponse} from "@/boundary/interfaces/user";
import {useEffect, useState} from "react";

export default function UsersMainSection() {
    const [userList, setUserList] = useState<UserResponse[]>([]);

    const queryParams: UserQueryParameters = new UserQueryParameters();
    useEffect(() => {
        getUsers(queryParams)
            .then(response => {
                if (response.statusCode === 200) {
                    console.log("response",response)
                    const parsedData: PagedResponse = response.data;
                    const { data, pagingMetaData } = parsedData;
                    const usersList:UserResponse[] = data;
                    setUserList(usersList);
                }
            })
            .catch(error => {
                toast.error(`Error fetching users ${error}`);
            });
    }, []);

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                        IsActive
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Email Confirmed
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Created On
                    </th>
                </tr>
                </thead>
                <tbody>
                {userList.map((user, key) => (
                    <tr key={user.id}
                        className="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th scope="row"
                            className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                            <div className="pl-3">
                                <div className="text-base font-semibold">{user.firstName} {user.lastName}</div>
                            </div>
                        </th>
                        <td className="px-6 py-4">
                            {user.email}
                        </td>
                        <td className="px-6 py-4">
                            {user.isActive.toString()}
                        </td>
                        <td className="px-6 py-4">
                            {user.emailConfirmed.toString()}
                        </td>
                        <td className="px-6 py-4">
                            {user.createdOn.toString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
};