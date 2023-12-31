
import { User } from "next-auth";
import { FC } from "react";
import {Avatar, AvatarFallback } from "./Avatar";
import Image from "next/image";
import { Icons } from "./Icon";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
    user:Pick<User,"name"|"image">
}

const UserAvatar: FC<UserAvatarProps> = ({user}) => {
    return <Avatar>
        {user.image?(
            <div className="relative aspect-square w-full h-full">
                <Image fill src={user.image} alt="User Avatar" referrerPolicy="no-referrer"/>
            </div>
        ):(
            <AvatarFallback>
                <span className="sr-only">{user?.name}</span>
                <Icons.user className="h-6 w-6" />
            </AvatarFallback>
        )}
    </Avatar>
}
export default UserAvatar