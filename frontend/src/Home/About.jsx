import React from "react";
function About(){
    return (<>
     <div name='about' className='w-full my-32'>
        <div className='max-w-[1240px] mx-auto'>
            <div className='text-center'>
                <h2 className='text-5xl font-bold'>Best results in the city throughout recent years</h2>
                <p className='text-3xl py-6 text-gray-500'>Our highly qualified and dedicated panel of teachers has proven their expertise in the field by creating the best results from 2015 to 2024 </p>
            </div>

            <div className='grid md:grid-cols-3 gap-1 px-2 text-center'>
                <div className='border py-8 rounded-xl shadow-xl' >
                    <p className='text-6xl font-bold text-[#1e81b0]'>3</p>
                    <p className='text-gray-400 mt-2'>Island rankers </p>
                </div>
                <div  className='border py-8 rounded-xl shadow-xl' >
                    <p className='text-6xl font-bold text-[#1e81b0]'>15+</p>
                    <p className='text-gray-400 mt-2'>District ranks</p>
                </div>
                <div className='border py-8 rounded-xl shadow-xl' >
                    <p className='text-6xl font-bold text-[#1e81b0]'>Over 1000</p>
                    <p className='text-gray-400 mt-2'>University entrants</p>
                </div>
            </div>
        </div>
    </div>
    </>);
}

export default About