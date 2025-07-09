import React from 'react';

import { CheckIcon } from '@heroicons/react/24/solid';
import stuImg from '../assets/study.jpg'


const Section2= () => {
  return (
    <div name='Section2' className='w-full text-white my-24 relative'>
      <div className='w-full h-[800px] bg-slate-900 absolute mix-blend-overlay'></div>

      <div className='max-w-[1240px] mx-auto py-12'>

        <div className='text-center py-8 text-slate-300'>
          <h2 className='text-3xl uppercase'>Our results of the year</h2>
          <h3 className='text-5xl font-bold text-white py-8'>2023</h3>
          <p className='text-3xl font-mono' >
           "We are dedicated to bring the best out of your child"
          </p>
        </div>

        <div className='grid md:grid-cols-4'>

        <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>Commerce</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>Student 1</p>
            </div>
            <p className='text-2xl py-8 text-slate-500'>AAA<br></br>Z Score-2.7890</p>
            <div className='text-2xl'>
                 <div>
                                <img className="w-full h-full object-cover" src={stuImg} alt=""></img>
                            </div>
                
            </div>
          </div>

          <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>Maths</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>Student 2</p>
            </div>
            <p className='text-2xl py-8 text-slate-500'>AAA<br></br>Z Score-2.7890</p>
            <div className='text-2xl'>
                 <div>
                                <img className="w-full h-full object-cover" src={stuImg} alt=""></img>
                            </div>
                
            </div>
          </div>
          <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>Biological science</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>Student 3</p>
            </div>
            <p className='text-2xl py-8 text-slate-500'>AAA<br></br>Z Score-2.7890</p>
            <div className='text-2xl'>
                 <div>
                                <img className="w-full h-full object-cover" src={stuImg} alt=""></img>
                            </div>
                
            </div>
          </div>
          <div className='bg-white text-slate-900 m-4 p-8 rounded-xl shadow-2xl relative'>
            <span className='uppercase px-3 py-1 bg-indigo-200 text-indigo-900 rounded-2xl text-sm'>Technology</span>
            <div>
              <p className='text-6xl font-bold py-4 flex'>Student 4</p>
            </div>
            <p className='text-2xl py-8 text-slate-500'>AAA<br></br>Z Score-2.7890</p>
            <div className='text-2xl'>
                 <div>
                                <img className="w-full h-full object-cover" src={stuImg} alt=""></img>
                            </div>
                
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section2