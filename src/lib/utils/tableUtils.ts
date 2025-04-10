const userTableColumns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "EMAIL", uid: "email", sortable: true},
    {name: "USERNAME", uid: "userName", sortable: true},
    {name: "STATUS", uid: "status", sortable: true},
    {name: "EMAIL CONFIRMED", uid: "emailConfirmed", sortable: true},
    {name: "CREATED ON", uid: "createdOn", sortable: true},
    {name: "ACTIONS", uid: "actions"},
];

const roleTableColumns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "NAME", uid: "name", sortable: true},
    {name: "DESCRIPTION", uid: "description", sortable: true},
    {name: "CREATED ON", uid: "createdOn", sortable: true},
    {name: "ACTIONS", uid: "actions"},
];

const auditTableColumns = [
    {name: "ID", uid: "id", sortable: true},
    {name: "MODULE", uid: "module", sortable: true},
    {name: "AUDIT TYPE", uid: "auditType", sortable: true},
    {name: "CREATOR NAME", uid: "creatorName", sortable: true},
    {name: "CREATOR EMAIL", uid: "creatorEmail", sortable: true},
    {name: "DESCRIPTION", uid: "description", sortable: true},
    {name: "IP ADDRESS", uid: "ipAddress", sortable: true},
    {name: "CREATED ON", uid: "createdOn", sortable: true},
    {name: "ACTIONS", uid: "actions"},
];


const statusOptions = [
    {name: "Active", uid: "active"},
    {name: "InActive", uid: "inactive"},
    {name: "Confirmed", uid: "confirmed"},
    {name: "UnConfirmed", uid: "unconfirmed"},
];

export {userTableColumns,roleTableColumns,auditTableColumns,statusOptions};

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}