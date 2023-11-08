const userTableColumns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "EMAIL", uid: "email", sortable: true},
    {name: "USERNAME", uid: "userName", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "EMAIL CONFIRMED", uid: "emailConfirmed", sortable: true},
    {name: "CREATED ON", uid: "CreatedOn", sortable: true},
    {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
    {name: "Active", uid: "active"},
    {name: "InActive", uid: "inactive"},
    {name: "Confirmed", uid: "confirmed"},
    {name: "UnConfirmed", uid: "unconfirmed"},
];

export {userTableColumns,statusOptions};

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function f() {

}