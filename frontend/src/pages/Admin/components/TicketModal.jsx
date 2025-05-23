import { AiOutlineClose } from 'react-icons/ai';
import { MdEmail } from "react-icons/md";
import { BiUserCircle } from 'react-icons/bi';
import { CgProfile } from "react-icons/cg";
import { LuType } from "react-icons/lu";
import { MdContactPhone } from "react-icons/md";
import { MdSubject } from "react-icons/md";
import { MdMessage } from "react-icons/md";

``
// eslint-disable-next-line react/prop-types
const BookModal = ({ book, onClose }) => {
  return (
    <div
      className='fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='w-[600px] max-w-full h-[400px] bg-white rounded-xl p-4 flex flex-col relative'
      >
        <AiOutlineClose
          className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer'
          onClick={onClose}
        />
        <h2 className='w-fit px-4 py-1 bg-red-300 rounded-lg'>
          {book.registrationNumber}
        </h2>
        <h4 className='my-2 text-gray-500'>Reg_No</h4>
        <div className='flex justify-start items-center gap-x-2'>
          <CgProfile className='text-red-300 text-2xl' />
          <div className="stat-title">Name = </div>
          <h2 className='my-1'>{book.name}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
          <MdEmail className='text-red-300 text-2xl' />
          <div className="stat-title">Email = </div>
          <h2 className='my-1'>{book.email}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
          <LuType className='text-red-300 text-2xl' />
          <div className="stat-title">Grade = </div>
          <h2 className='my-1'>{book.grade}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
          <MdContactPhone className='text-red-300 text-2xl' />
          <div className="stat-title">ContactNumber = </div>
          <h2 className='my-1'>{book.contactNumber}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
          <LuType className='text-red-300 text-2xl' />
          <div className="stat-title">Category = </div>
          <h2 className='my-1'>{book.category}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
          <MdSubject className='text-red-300 text-2xl' />
          <div className="stat-title">Subject = </div>
          <h2 className='my-1'>{book.subject}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
          <MdMessage className='text-red-300 text-2xl' />
          <div className="stat-title">Message = </div>
          <h2 className='my-1'>{book.message}</h2>
        </div>
        

        
       
      </div>
    </div>
  );
};

export default BookModal;
