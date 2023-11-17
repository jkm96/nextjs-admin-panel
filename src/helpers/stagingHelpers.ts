import {RoleModuleActions, UserModuleActions} from "@/lib/utils/stagingUtils";
import {AppModules, StagingResponse} from "@/boundary/interfaces/staging";
import {User} from "@/boundary/interfaces/user";

const getActionsForModule = (module:AppModules) => {
    switch (module) {
        case AppModules.USERS:
            return UserModuleActions;
        case AppModules.ROLES:
            return RoleModuleActions;
        default:
            return [];
    }
};

export { getActionsForModule };


export function checkIfCanApproveAction(user: User|null, canApproveAction: boolean, stagingRecord: StagingResponse):boolean {
    if (user !== null && user?.isDefaultAdmin != 1 && canApproveAction && stagingRecord.creator !== user.email) {
        return true
    }

    return user?.isDefaultAdmin === 1;
}

