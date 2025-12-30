import { MenuIcon } from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { logoutUser } from '@/store/slices/authSlice';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MenuList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isLoggedIn = useSelector(
        (state) => state.auth.isAuthenticated
    );

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <MenuIcon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuGroup>
                    {isLoggedIn ? (
                        <Link to="/profile">
                            <DropdownMenuItem>
                                Profile
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </Link>
                    ) : (
                        <Link to="/login">
                            <DropdownMenuItem>
                                Login
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </Link>
                    )}
                </DropdownMenuGroup>

                {isLoggedIn && (
                    <>
                        <DropdownMenuGroup>
                            <Link to="/messages">
                                <DropdownMenuItem>Messages</DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <Link to="/wishlists">
                                <DropdownMenuItem>Wishlist</DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <Link to="/ai-recommendation">
                                <DropdownMenuItem>AI Recommendation</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator />

                <Link to="/help">
                    <DropdownMenuItem>Support</DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
