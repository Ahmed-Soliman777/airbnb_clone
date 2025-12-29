import { MenuIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button } from "@/components/ui/button"
import { isAuthenticated } from '../../utils/cookies';
import { logoutUser } from '@/store/slices/authSlice';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MenuList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(isAuthenticated());
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            setIsLoggedIn(false);
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={''}><MenuIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                    {
                        isLoggedIn ? (
                            <Link to='/profile'>
                                <DropdownMenuItem>
                                    Profile
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        ) : (
                            <Link to='/login'>
                                <DropdownMenuItem>
                                    Login
                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        )
                    }
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {isLoggedIn && (
                    <DropdownMenuGroup>
                        <Link to='/messages'>
                            <DropdownMenuItem>Messages</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                    </DropdownMenuGroup>
                )}
                {isLoggedIn && (
                    <DropdownMenuGroup>
                        <Link to='/wishlists'>
                            <DropdownMenuItem>Wishlist</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                    </DropdownMenuGroup>
                )}
                {isLoggedIn && (
                    <DropdownMenuGroup>
                        <Link to='/ai-recommendation'>
                            <DropdownMenuItem>AI Recommendation</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                    </DropdownMenuGroup>
                )}
                <Link to='/help'>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                </Link>
                {isLoggedIn && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
