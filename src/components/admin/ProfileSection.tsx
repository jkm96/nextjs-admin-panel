import {User} from "@/boundary/interfaces/user";
import Breadcrumb from "@/components/breadcrumbs/Breadcrumb";
import Image from "next/image";
import CameraIcon from "@/components/shared/icons/CameraIcon";

interface ProfileSectionProps {
    user: User | null;
}

export default function ProfileSection({user}: ProfileSectionProps) {
    return (
        <>
            <Breadcrumb pageName="Profile"/>

            <div
                className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <Image
                        src={"/images/cover/cover-01.png"}
                        alt="profile cover"
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                        width={970}
                        height={260}
                    />
                    <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                        <label
                            htmlFor="cover"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                        >
                            <input type="file" name="cover" id="cover" className="sr-only"/>
                            <span><CameraIcon/></span>
                            <span>Edit</span>
                        </label>
                    </div>
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div
                        className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2">
                            <Image
                                src={"/images/user/user-06.png"}
                                width={160}
                                height={160}
                                alt="profile"
                            />
                            <label
                                htmlFor="profile"
                                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                            >
                                <CameraIcon/>
                                <input
                                    type="file"
                                    name="profile"
                                    id="profile"
                                    className="sr-only"
                                />
                            </label>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            {user?.name}
                        </h3>
                        <p className="font-medium">{user?.email}</p>

                        <div className="mx-auto max-w-180">
                            <h4 className="font-semibold text-black dark:text-white">
                                About Me
                            </h4>
                            <p className="mt-4.5">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Pellentesque posuere fermentum urna, eu condimentum mauris
                                tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
                                ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
                                pharetra ligula sed, aliquam lacus.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}


