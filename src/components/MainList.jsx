import React from 'react'
import { CalendarIcon } from 'lucide-react'
import { MoreVerticalIcon } from 'lucide-react'
import { useState } from "react";

const MainList = ({setAddIsOpen}) => {
  const [moreIsOpen, setMoreIsOpen] = useState(false);
  return (
    <div>
      <div id="list-task" className='bg-[#0b0a18] flex text-white rounded-xl justify-around items-center'>
        <div className="checklistbutton flex items-center ">
          <label htmlFor="check" className="flex items-center cursor-pointer ">
            <input
              type="checkbox"
              id="check"
              className="peer sr-only"
            />

            <div className="
              w-6 h-6
              rounded-md
              border-2 border-[#853dfa]
              bg-[#0b0a18]
              flex items-center justify-center
              peer-checked:bg-[#853dfa]
              peer-checked:after:content-['✓']
              peer-checked:after:text-white
              peer-checked:after:text-sm">
            </div>
          </label>
        </div>
        <div id="textDescription" className="flex flex-col">
          <h1 id='titleTask' className='pt-2 font-semibold px-3 text-sm'>Belajar React Dasar</h1>
          <p id='captionTask' className='px-3 text-[12px]'>Pelajari components dan props</p>
          <div id="dateTask" className='flex py-4 px-3 gap-2'>
            <CalendarIcon className='w-4 h-4 mt-[2px]'/>
            <p id='dateTaskInformation' className='text-xs'>12 Agustus 2026</p>
          </div>
        </div>
        <div className="icon h-full flex flex-col gap-8 items-end">
            <MoreVerticalIcon onClick={(event) => {
              setMoreIsOpen(!moreIsOpen)
            }}/>
            <div className='bg-[#2e1757] rounded-sm'><p id='isDone' className='text-[8px] p-1'>Belum Selesai</p></div>
              <div className={`fixed  z-50 flex items-center justify-center bg-[#853dfa] w-20 h-10 rounded-sm mt-10 text-[12px] flex flex-col gap-0.3 items-start px-[8px] transition-all duration-200 ease-out ${moreIsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} md:w-24 md:h-12 md:text-[14px] md:mt-8`}>
                <button onClick={() => setAddIsOpen(true)} className='relative after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full'>Edit</button>
                <button className='relative after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:-translate-x-1/2 after:transition-all after:duration-300 hover:after:w-full'>Hapus</button>
              </div>
            </div>
      </div>
    </div>
  )
}

export default MainList
