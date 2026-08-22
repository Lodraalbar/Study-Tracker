import React from 'react';
import totalTugas from '../assets/total_tugas.png';
import selesai from '../assets/selesai.png';
import belumSelesai from '../assets/belum_selesai.png';
import calendar from '../assets/calendar.png';
import { useState } from "react";

const Recap = () => {
  const [addIsOpen, setAddIsOpen] = useState(false);
  return (
    
    <div className='flex flex-col'>
      <div id="greeting" className='text-white py-4'>
        <h1 className='text-2xl font-medium'>Halo,Lodra🙌</h1>
        <p className='text-sm'>Tetap konsisten belajar dan raih tujuanmu!</p>
      </div>
      <div id="box-recap" className=' relative bg-[#0b0a18] w-90 mx-auto h-45 rounded-xl after:absolute after:top-0 after:right-0 after:w-10 after:h-10 after:border-t-2 after:border-r-2 after:border-[#853dfa] after:rounded-tr-xl flex flex-col justify-center text-white px-2'>
        <ul className='flex space justify-between'>
          <li className='flex flex-col items-center w-26 h-26'>
            <div className='bg-[#2e1757] rounded-4xl w-10 h-10 flex items-center justify-center'><img src={totalTugas} alt="icon-total-tugas" className='h-6 w-6 brightness-0 invert'/></div>
            <h2 id='total-tugas' className='text-lg font-semibold'>6</h2>
            <p className='text-[10px]'>Total Tugas</p>
          </li>
          <li className='flex flex-col items-center w-26 h-26'>
            <div className='bg-[#2e1757] rounded-4xl w-10 h-10 flex items-center justify-center'><img src={selesai} alt="icon-selesai" className='h-6 w-6 brightness-0 invert'/></div>
            <h2 id='selesai' className='text-lg font-semibold'>6</h2>
            <p className='text-[10px]'>Selesai</p>
          </li>
          <li className='flex flex-col items-center w-26 h-26'>
            <div className='bg-[#2e1757] rounded-4xl w-10 h-10 flex items-center justify-center'><img src={belumSelesai} alt="icon-belum-selesai" className='h-6 w-6 brightness-0 invert'/></div>
            <h2 id='belum-selesai' className='text-lg font-semibold'>6</h2>
            <p className='text-[10px]'>Belum Selesai</p>
          </li>
          <li className='flex flex-col items-center w-26 h-26'>
            <div className='bg-[#2e1757] rounded-4xl w-10 h-10 flex items-center justify-center'><img src={calendar} alt="icon tugas-hari-ini" className='h-6 w-6 brightness-0 invert'/></div>
            <h2 id='tugas-hari-ini' className='text-lg font-semibold'>6</h2>
            <p className='text-[10px]'>Tugas Hari Ini</p>
          </li>
        </ul>
        <button className='bg-[#853dfa] py-1 w-75 mx-auto  rounded-xl font-medium' onClick ={() => setAddIsOpen(true)} >+   Tambah Tugas</button>
      </div>
      {addIsOpen && (
        <div className="popup fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className = "bg-[#853dfa] w-90 h-75 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className='flex items-center justify-between  w-full '>
              <h2 className='text-white text-lg font-semibold ml-20 '>Tambah Tugas</h2>
              <button className='text-white text-lg font-semibold ml-20' onClick={() => setAddIsOpen(false)}>X</button>
            </div>
            <div className="form flex flex-col ">
              <div className = "text-white">
                <label htmlFor="judul" className='text-white'>Judul Tugas</label>
                <input type="text" id="judul" name="judul" placeholder='Contoh: Belajar Matematika' className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
              </div>
              <div className = "text-white">
                <label htmlFor="deskripsi" className='text-white'>Deskripsi Tugas</label>
                <input type="text" id="deskripsi" name="deskripsi" placeholder='Contoh: Selesaikan latihan halaman 10-15' className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
              </div>
              <div className = "text-white">
                <label htmlFor="deadline" className='text-white'>Deadline</label>
                <input type="date" id="deadline" name="deadline" className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
              </div>
            </div>
            <button className='bg-[#2e1757] text-white py-1 w-75 mx-auto mt-4 rounded-xl font-medium' onClick={() => setAddIsOpen(false)}>Simpan</button>
          </div>

        </div>
      )}
    </div>
    
   
    
  )
}

export default Recap

