import React from "react";
import { CloudArrowUpIcon, PaperAirplaneIcon, ServerIcon } from '@heroicons/react/24/solid';
import bgImg from '../assets/back_img.png'
import { useNavigate } from "react-router";



function Hero(){
    const navigate=useNavigate();
    const GoTo=()=>{
        navigate('/register')
    }
    return(<>
    <div className="w-full h-screen bg-[#e28743] flex flex-col justify-between my-0 ">
        <div className="grid md:grid-cols-2 max-w-[1240px] m-auto">
            <div className="flex flex-col justify-center md:items-start w-full px-2 py-8">
                <p className="text-4xl font-bold ">Get excellent results from</p>
                <h1 className="py-3 text-5xl md:text-7xl font-bold">Best teachers</h1>
                <p className="text-3xl font-bold">in the city</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 my-3 mr-4" onClick={GoTo}>
        Register now!
      </button>
            </div>
            <div>
                <img className="w-full h-full object-cover" src={bgImg} alt=""></img>
            </div>
        </div>
    </div>
    </>)
}

export default Hero