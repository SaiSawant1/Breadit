"use client"
import { User } from "next-auth";
import { de } from "date-fns/locale";
import { FC } from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import UserAvatar from "./UserAvatar";
import { DropdownMenuContent } from "./dropdown-menu";
import { DropdownMenuSeparator } from "./dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
    user:Pick<User,"name"|"image"|"email">
}

const UserAccountNav: FC<UserAccountNavProps> = ({user}) => {
    return <DropdownMenu>
        <DropdownMenuTrigger>
            <UserAvatar user={user}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white" align="end">
            <div className="flex items-start justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                    {user.name&&<p className="font-medium">{user.name}</p>}
                    {user.email&&<p className="w-[200px] truncate text-sm text-zinc-700">{user.email}</p>}
                </div>
            </div>
            <DropdownMenuSeparator/>
            <DropdownMenuItem asChild>
                <Link href="/">Feed</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/r/create">Create Community</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/settings">setting</Link>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={(e)=>{
                e.preventDefault()
                signOut({
                    callbackUrl:`${window.location.origin}/sign-in`
                })
            }} className="cursor-pointer font-semibold hover:text-red-500 text-red-900 ">
                Sign out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>;
}
export default UserAccountNav