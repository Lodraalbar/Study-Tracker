import React from 'react';
import totalTugas from '../assets/total_tugas.png';
import selesai from '../assets/selesai.png';
import belumSelesai from '../assets/belum_selesai.png';
import calendar from '../assets/calendar.png';
import { useState } from "react";

const Recap = ({ setAddIsOpen, recap, todayLabel }) => {
  
  return (
// {greeting}

    <div className='flex flex-col'>
      <div id="greeting" className='text-white py-4'>
        <h1 className='text-2xl font-medium md:text-3xl'>Halo,lodra🙌</h1>
        <p className='text-sm md:text-2xl'>Tetap konsisten belajar dan raih tujuanmu!</p>
      </div>

{/* recap box */}
      <div id="box-recap" className=' relative bg-[#0b0a18] w-90 mx-auto h-45 rounded-xl after:absolute after:top-0 after:right-0 after:w-10 after:h-10 after:border-t-2 after:border-r-2 after:border-[#853dfa] after:rounded-tr-xl flex flex-col justify-center text-white px-2 md:w-[100%] md:h-65 md:mb-5 md:flex md:items-center md:justify-center '>
        <ul className='flex justify-between md:justify-around md:gap-2 md:w-[80%] md:px-10 md:pt-3'>
          <li className='flex flex-col items-center w-26 h-26 md:h-40 md:w-50 lg:w-60'>
            <div className='bg-[#2e1757] rounded-full w-10 h-10 flex items-center justify-center md:w-20 md:h-20 lg: '><img src={totalTugas} alt="icon-total-tugas" className='h-6 w-6 brightness-0 invert md:h-10 md:w-10'/></div>
            <h2 id='total-tugas' className='text-lg font-semibold md:text-2xl'>{recap.total}</h2>
            <p className='text-[10px] md:text-lg'>Total Tugas</p>
          </li>
          <li className='flex flex-col items-center w-26 h-26 md:h-40 md:w-50'>
            <div className='bg-[#2e1757] rounded-4xl w-10 h-10 flex items-center justify-center md:w-20 md:h-20 md:rounded-full'><img src={selesai} alt="icon-selesai" className='h-6 w-6 brightness-0 invert md:h-10 md:w-10'/></div>
            <h2 id='selesai' className='text-lg font-semibold md:text-2xl'>{recap.completed}</h2>
            <p className='text-[10px] md:text-lg'>Selesai</p>
          </li>
          <li className='flex flex-col items-center w-26 h-26 md:h-40 md:w-50'>
            <div className='bg-[#2e1757] rounded-4xl w-10 h-10 flex items-center justify-center md:w-20 md:h-20 md:rounded-full'><img src={belumSelesai} alt="icon-belum-selesai" className='h-6 w-6 brightness-0 invert md:h-10 md:w-10'/></div>
            <h2 id='belum-selesai' className='text-lg font-semibold md:text-2xl'>{recap.incomplete}</h2>
            <p className='text-[10px] md:text-lg'>Belum Selesai</p>
          </li>
          <li className='flex flex-col items-center w-26 h-26 md:h-40 md:w-50'>
            <div className='bg-[#2e1757] rounded-4xl w-10 h-10 flex items-center justify-center md:w-20 md:h-20 md:rounded-full'><img src={calendar} alt="icon tugas-hari-ini" className='h-6 w-6 brightness-0 invert md:h-10 md:w-10'/></div>
            <h2 id='tugas-hari-ini' className='text-lg font-semibold md:text-2xl'>{recap.today}</h2>
            <p className='text-[10px] md:text-lg'>Tugas Hari Ini</p>
            <p className='text-[8px] md:text-sm text-gray-300'>{todayLabel}</p>
          </li>
        </ul>
        <button className='bg-[#853dfa] py-1 w-75 mx-auto  rounded-xl font-medium md:w-90 md:text-xl ' onClick ={() => setAddIsOpen(true)} >+   Tambah Tugas</button>
      </div>
      
    </div>
    
   
    
  )
}

export default Recap

