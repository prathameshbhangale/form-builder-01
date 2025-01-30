import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ApplyGradient from './helpers/ApplyGradient';
import HiglightText from './helpers/HiglightText';
import { RiAccountBoxFill } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { clearUserData } from '../../slices/user';
import { Outlet } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    let token = useSelector((state: RootState) => state.user?.token);
    const name = useSelector((state: RootState) => state.user?.name);
    const email = useSelector((state: RootState) => state.user?.email);

    const handleLogout = () => {
        dispatch(clearUserData());
        console.log(token)
        token = ""
    };

    return (
        <>
        <nav className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
            <Link to="/">
                <div className="text-xl font-bold"><ApplyGradient text='FoRm_BuilDER' /></div>
            </Link>

            <ul className="flex space-x-6">
                <li>
                    <Link to="/forms" className="hover:underline">Forms</Link>
                </li>
                <li>
                    <Link to="/responses" className="hover:underline">Responses</Link>
                </li>
                <li>
                    <Link to="/form/initilize" className="hover:underline">Create Form</Link>
                </li>
            </ul>

            {!token ? (
                <div className='flex gap-3'>
                    {/* <div>{`pop${token}`}</div> */}
                    <Link to="/login">
                        <button className="rounded-lg border border-richblack-700 px-2 py-2 text-richblack-100 font-semibold transition-all duration-300 hover:bg-richblack-700 hover:border-richblack-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-richblack-600">
                            <HiglightText text='Log in' />
                        </button>
                    </Link>
                    <Link to="/signup">
                        <button className="rounded-lg border border-richblack-700 px-2 py-2 text-richblack-100 font-semibold transition-all duration-300 hover:bg-richblack-700 hover:border-richblack-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-richblack-600">
                            <HiglightText text='Sign up' />
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="relative">
                    <button
                        className="flex items-center"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <RiAccountBoxFill size={27} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg">
                            <div className="px-4 py-2 border-b">
                                <p className="font-semibold">{name}</p>
                                <p className="text-sm text-gray-500">{email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
        <div>
            <Outlet></Outlet>
        </div>
        </>
    );
};

export default Navbar;
