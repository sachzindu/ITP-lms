import React, {useState} from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Navbar(){

    const [nav,setNav]=useState(false);
    

    return (<>
    <div className="w-screen h-[80px] z-10 bg-[#eeeee4] fixed drop-shadow-lg">
        <div className="px-2 flex justify-between items-center w-full h-full">
            <div className="flex items-center">
                <h1 className="text-3xl font-bold mr-4 sm:text-4xl">IgniteLearn</h1>
                <ul className="hidden md:flex">
                    <li>Home</li>
                    <li>Classes</li>
                    <li>Support</li>
                    <li>About us</li>
                </ul>
            </div>
            <div className="hidden md:flex p-4">
                <button className="border-none bg-transparent text-black mr-4 ">Sign in</button>
                <button className="px-8 py-3"> Sign up</button>
            </div>

            <div className="md:hidden  ">
            <Bars3Icon className="w-5"></Bars3Icon>

            </div>

        </div>
        

      
    </div>

    </>)

}

export default Navbar