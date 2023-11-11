import {RoleModuleActions, UserModuleActions} from "@/lib/utils/stagingUtils";
import {AppModules} from "@/boundary/interfaces/staging";

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

