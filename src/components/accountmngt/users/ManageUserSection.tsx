import React, {useEffect, useState} from "react";
import {getUserById} from "@/lib/services/accountmngt/userService";
import {toast} from "react-toastify";
import {
    Button,
    Checkbox, Chip,
    Input
} from "@nextui-org/react";
import PersonIcon from "@/components/shared/icons/PersonIcon";
import {UserResponse} from "@/boundary/interfaces/user";
import {MailIcon} from "@/components/shared/icons/MailIcon";
import {CheckIcon} from "@/components/shared/icons/CheckIcon";
import {CrossIcon} from "@/components/shared/icons/CrossIcon";

const initialUserData: UserResponse = {
    changePasswordOnLogin: false,
    createdOn: new Date(),
    email: "",
    emailConfirmed: "",
    enableEmailOtp: false,
    enableSmsOtp: false,
    firstName: "",
    id: "",
    isActive: "",
    isDeleted: false,
    lastName: "",
    phoneNumber: "",
    profilePictureDataUrl: "",
    userName: ""
}
export default function ManageUserSection({userId}: { userId: string }) {
    const [userDetails, setUserDetails] = useState<UserResponse>(initialUserData);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputErrors, setInputErrors] = useState({
        email: "", lastName: "", phoneNumber: "",
        firstName: "", userName: ""
    });
    const isActive = userDetails.isActive === 'active';
    const isEmailConfirmed = userDetails.emailConfirmed === 'confirmed';

    const fetchUserDetails = async (userId: string) => {
        setIsLoading(true);
        try {
            const response = await getUserById(userId);
            if (response.statusCode === 200) {
                setUserDetails(response.data);
            }
        } catch (error) {
            toast.error(`Error fetching user details: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserDetails(userId);
    }, [userId]);

    const handleChange = (e: any) => {
        const {name, value} = e.target;
        setUserDetails({...userDetails, [name]: value});
    }

    const handleUserEditSubmit = async (e: any) => {
    }

    return (
        <>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h3>User Details</h3>
                    <form onSubmit={handleUserEditSubmit}>
                        <div className="grid md:grid-cols-3 md:gap-4">
                            <Input type="email"
                                   className="mt-2 mb-1 "
                                   defaultValue={userDetails.email}
                                   label="Email"
                                   endContent={
                                       <MailIcon
                                           className="fill-current"/>
                                   }
                                   readOnly={true}
                                   variant={"bordered"}
                            />

                            <Input type="email"
                                   className="mt-2 mb-1 "
                                   defaultValue={userDetails.createdOn.toString()}
                                   label="Created On"
                                   endContent={
                                       <PersonIcon
                                           className="fill-current"/>
                                   }
                                   readOnly={true}
                                   variant={"bordered"}
                            />

                            <Input type="text"
                                   onChange={handleChange}
                                   value={userDetails.userName}
                                   label="Username"
                                   name="userName"
                                   className="mt-2 mb-1 "
                                   variant={"bordered"}
                                   placeholder="Enter username"
                                   endContent={
                                       <PersonIcon
                                           className="fill-current"/>
                                   }
                                   onInput={() => {
                                       setInputErrors({...inputErrors, userName: ""});
                                   }}
                                   isInvalid={inputErrors.userName !== ""}
                                   errorMessage={inputErrors.userName}/>
                        </div>

                        <div className="grid md:grid-cols-3 md:gap-4">
                            <Input type="text"
                                   onChange={handleChange}
                                   value={userDetails.firstName}
                                   label="FirstName"
                                   name="firstName"
                                   endContent={
                                       <PersonIcon
                                           className="fill-current"/>
                                   }
                                   variant={"bordered"}
                                   className="mt-2 mb-1 "
                                   placeholder="Enter firstName"
                                   onInput={() => {
                                       setInputErrors({...inputErrors, firstName: ""});
                                   }}
                                   isInvalid={inputErrors.firstName !== ""}
                                   errorMessage={inputErrors.firstName}/>

                            <Input type="text"
                                   onChange={handleChange}
                                   value={userDetails.lastName}
                                   label="Lastname"
                                   name="lastName"
                                   endContent={
                                       <PersonIcon
                                           className="fill-current"/>
                                   }
                                   variant={"bordered"}
                                   className="mt-2 mb-1 "
                                   placeholder="Enter lastName"
                                   onInput={() => {
                                       setInputErrors({...inputErrors, lastName: ""});
                                   }}
                                   isInvalid={inputErrors.lastName !== ""}
                                   errorMessage={inputErrors.lastName}/>

                            <Input type="text"
                                   onChange={handleChange}
                                   value={userDetails.phoneNumber ?? ""}
                                   label="PhoneNumber"
                                   name="phoneNumber"
                                   endContent={
                                       <PersonIcon
                                           className="fill-current"/>
                                   }
                                   variant={"bordered"}
                                   className="mt-2 mb-1 "
                                   placeholder="Enter phone number"
                                   onInput={() => {
                                       setInputErrors({...inputErrors, phoneNumber: ""});
                                   }}
                                   isInvalid={inputErrors.phoneNumber !== ""}
                                   errorMessage={inputErrors.phoneNumber}/>
                        </div>

                        <div className="flex justify-end mt-4 gap-1">
                            <Button color="primary"
                                    type="submit"
                                    onClick={handleUserEditSubmit}
                            >
                                {isSubmitting ? "Submitting..." : "Edit User"}
                            </Button>
                        </div>

                        <h3 className="mt-4">User Status</h3>

                        <div className="flex gap-4 py-4">
                            <Chip
                                startContent={isActive ? <CheckIcon size={18} /> : <CrossIcon size={18} />}
                                variant="light"
                                color={isActive ? 'success' : 'danger'}
                            >
                                Active Status
                            </Chip>

                            <Chip
                                startContent={isEmailConfirmed ? <CheckIcon size={18} /> : <CrossIcon size={18} />}
                                variant="light"
                                color={isEmailConfirmed ? 'success' : 'danger'}
                            >
                                Email Confirmed
                            </Chip>

                            <Chip
                                startContent={userDetails.enableSmsOtp ? <CheckIcon size={18} /> : <CrossIcon size={18} />}
                                variant="light"
                                color={userDetails.enableSmsOtp ? 'success' : 'danger'}
                            >
                                SmsOtp Enabled
                            </Chip>

                            <Chip
                                startContent={userDetails.enableEmailOtp ? <CheckIcon size={18} /> : <CrossIcon size={18} />}
                                variant="light"
                                color={userDetails.enableEmailOtp ? 'success' : 'danger'}
                            >
                                EmailOtp Enabled
                            </Chip>
                        </div>

                    </form>
                </>
            )}
        </>
    );
}
