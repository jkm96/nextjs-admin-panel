"use client";
import { useEffect, useState } from 'react';
import {hasRequiredPermissions} from "@/helpers/permissionsHelper";
import Authorizing from "@/components/common/auth/Authorizing";
import PermissionDeniedMessage from "@/components/common/auth/PermissionDeniedMessage";

const AuthorizeComponent = (requiredPermissions:any) => (WrappedComponent:any) => {
    const AuthComponent = (props:any) => {
        const [hasPermission, setHasPermission] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkPermissions = async () => {
                try {
                    const permissionStatus = await hasRequiredPermissions(requiredPermissions);
                    setHasPermission(permissionStatus);
                } catch (error) {
                    console.error("Permission check failed:", error);
                    setHasPermission(false)

            } finally {
                setLoading(false);
            }
            };

            checkPermissions();
        }, [requiredPermissions]);

        if (loading) {
            return <Authorizing/>
        }

        if (!hasPermission) {
            return <PermissionDeniedMessage />;
        }

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default AuthorizeComponent;
