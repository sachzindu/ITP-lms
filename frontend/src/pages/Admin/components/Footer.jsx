import React from 'react'

import {
    FaFacebook,
    FaGithub,
    FaInstagram,
    FaTwitter,
    FaTwitch,
} from 'react-icons/fa'

const Footer = () => {
  return (
    <div className='w-full mt-24 bg-[#e28743]  py-y px-2'>
        <div className='max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-6 border-b-2 py-8'>
            <div>
                <h6 className='font-bold uppercase pt-2'>A/L Batches</h6>
                <ul>
                    <li className='py-1'>2025 A/L</li>
                    <li className='py-1'>2026 A/L</li>
                    <li className='py-1'>2027 A/L</li>
                    
                </ul>
            </div>
            <div>
                <h6 className='font-bold uppercase pt-2'>Streams</h6>
                <ul>
                    <li className='py-1'>Maths</li>
                    <li className='py-1'>Biological sciences</li>
                    <li className='py-1'>Commerce</li>
                    <li className='py-1'>Technology</li>
                </ul>
            </div>
            <div>
                <h6 className='font-bold uppercase pt-2'>Institution</h6>
                <ul>
                    <li className='py-1'>About</li>
                    <li className='py-1'>Blog</li>
                    <li className='py-1'>Mission</li>
                    <li className='py-1'>Vision</li>
                    
                    
                </ul>
            </div>
            <div>
                <h6 className='font-bold uppercase pt-2'>Legal Info</h6>
                <ul>
                    <li className='py-1'>Claims</li>
                    <li className='py-1'>Privacy</li>
                    <li className='py-1'>Terms</li>
                    <li className='py-1'>Policies</li>
                    <li className='py-1'>Conditions</li>
                </ul>
            </div>
            <div className='col-span-2 pt-8 md:pt-2'>
                <p className='font-bold uppercase'>Send us feedback</p>
                <p className='py-4'>We value your thougths about the site</p>
                <form className='flex flex-col sm:flex-row'>
                    <input className='w-full p-2 mr-4 rounded-md mb-4' type="email" placeholder='Enter message..'/>
                    <button className='p-2 mb-4 '>Send!</button>
                </form>
            </div>
        </div>

        <div className='flex flex-col max-w-[1240px] px-2 py-4 mx-auto justify-between sm:flex-row text-center'>
        <p className='py-4'>2025 IgniteLearn </p>
        <div className='flex justify-between sm:w-[300px] pt-4 text-2xl'>
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            
        </div>
        </div>
    </div>
  )
}

export default Footer