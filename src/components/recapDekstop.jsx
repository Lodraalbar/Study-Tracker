import React from 'react'
import totalTugas from '../assets/total_tugas.png';
import selesai from '../assets/selesai.png';
import belumSelesai from '../assets/belum_selesai.png';
import calendar from '../assets/calendar.png';

const RecapDesktop = () => {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex w-full h-28  text-white mt-5 mb-5 '>
        <div className= 'bg-[#0b0a18] border border-[1px] border-[#853dfa] -center w-1/4 h-full mx-2 flex items-center justify-center gap-2 rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-1'>
            <div className='bg-[#853dfa] rounded-full w-10 h-10 flex justify-center items-center'><img src={totalTugas} alt="Total Tugas" className='w-8 h-8'/></div>
            <div>
                <h1 className=''>6</h1>
                <p className='text-[14px]'>Total Tugas</p>
            </div>
        </div>
        <div className= 'bg-[#0b0a18] border border-[#853dfa] -center w-1/4 h-full mx-2 flex items-center justify-center gap-2 rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-1'>
            <div className='bg-[#853dfa] rounded-full w-10 h-10 flex justify-center items-center'><img src={selesai} alt="Total Tugas" className='w-8 h-8'/></div>
            <div>
                <h1 className=''>6</h1>
                <p className='text-[14px]'>Selesai</p>
            </div>
        </div>
        <div className= 'bg-[#0b0a18] border border-[#853dfa] -center w-1/4 h-full mx-2 flex items-center justify-center gap-2 rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-1'>
            <div className='bg-[#853dfa] rounded-full w-10 h-10 flex justify-center items-center'><img src={belumSelesai} alt="Total Tugas" className='w-8 h-8'/></div>
            <div>
                <h1 className=''>6</h1>
                <p className='text-[14px]'>Belum Selesai</p>
            </div>
        </div>
        <div className= 'bg-[#0b0a18] border border-[#853dfa] -center w-1/4 h-full mx-2 flex items-center justify-center gap-2 rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-1'>
            <div className='bg-[#853dfa] rounded-full w-10 h-10 flex justify-center items-center'><img src={calendar} alt="Total Tugas" className='w-8 h-8'/></div>
            <div>
                <h1 className=''>6</h1>
                <p className='text-[14px]'>Tugas Hari Ini</p>
            </div>
        </div>
      </div>
      <div>
        <button className='bg-[#853dfa] py-1 w-35 mx-auto rounded-xl font-medium text-white text-[12px] hover:bg-white hover:text-[#853dfa]' >+   Tambah Tugas</button>
      </div>
    </div>
  )
}

export default RecapDesktop
