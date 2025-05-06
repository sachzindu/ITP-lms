import React from "react";
import { CloudArrowUpIcon, PaperAirplaneIcon, ServerIcon } from '@heroicons/react/24/solid';
import bgImg from '../assets/back_img.png'



function Hero(){
    return(<>
    <div className="w-full h-screen bg-[#e28743] flex flex-col justify-between">
        <div className="grid md:grid-cols-2 max-w-[1240px] m-auto">
            <div className="flex flex-col justify-center md:items-start w-full px-2 py-8">
                <p className="text-4xl font-bold ">Get excellent results from</p>
                <h1 className="py-3 text-5xl md:text-7xl font-bold">Best teachers</h1>
                <p className="text-3xl font-bold">in the city</p>
                <button className="py-3 px-6 my-4 ">Register now!</button>
            </div>
            <div>
                <img className="w-200% h-full object-cover " src={bgImg} alt=""></img>
            </div>
        </div>
    </div>
    </>)
}

export default Hero