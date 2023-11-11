import {RoleModuleActions, UserModuleActions} from "@/lib/utils/stagingUtils";
import {AppModule} from "@/boundary/interfaces/staging";

const getActionsForModule = (module: AppModule) => {
    switch (module) {
        case AppModule.USERS:
            return UserModuleActions;
        case AppModule.ROLES:
            return RoleModuleActions;
        default:
            return [];
    }
};

export { getActionsForModule };

