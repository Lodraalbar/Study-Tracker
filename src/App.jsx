import { useState } from 'react';
import './components/Navbar.jsx';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Recap from './components/Recap.jsx';
import MainList from './components/MainList.jsx';
import listIcon from './assets/list.png'

function App() {

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState('Semua');
  const [addIsOpen, setAddIsOpen] = useState(false);
  return (
    <>

      <Navbar/>
      <Recap setAddIsOpen={setAddIsOpen}/>
      <div className='py-3 flex justify-between'>
        <div id="judul-list " className='flex'>
          <img src={listIcon} alt=""  className='w-5 h-5 brightness-0 invert mt-1'/>
          <h2 className='text-white font-semibold px-3 text-xl'>Daftar Tugas</h2>
        </div>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className='text-white bg-[#0b0a18] w-25 h-8 text-sm rounded-lg flex justify-between items-center' ><span className='mx-auto'>{filter}</span> <span className='mx-auto'>⬇️</span></button>
        
      </div>
      {isFilterOpen && (
        <div className='text-white bg-[#853dfa] w-48 h-35 right-0 absolute font-semibold flex flex-col justify-around py-2 px-5 rounded-xl'>
          <p onClick={() => {
            setFilter('Semua');
            setIsFilterOpen(false);
          }}>Semua</p>
          <p onClick={ () => {
            setFilter('Selesai');
            setIsFilterOpen(false);
          }}>Selesai</p>
          <p onClick={ () => {
            setFilter('Belum Selesai');
            setIsFilterOpen(false);
          }}>Belum Selesai</p>
          <p onClick={ ()=> {
            setFilter('Tugas Hari Ini');
            setIsFilterOpen(false)
          }}>Tugas Hari Ini</p>
        </div>
      )}

      {/* fitur pop up form tambah tugas */}
      <MainList setAddIsOpen={setAddIsOpen}/>
      {addIsOpen && (
        <div className="popup fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className = "bg-[#853dfa] w-90 h-75 rounded-xl p-4 flex flex-col items-center justify-center">
            <div className='flex items-center justify-between  w-full '>
              <h2 className='text-white text-lg font-semibold ml-20 '>Tambah Tugas</h2>
              <button className='text-white text-lg font-semibold ml-20' onClick={() => setAddIsOpen(false)}>X</button>
            </div>
            <div className="form flex flex-col w-full ">
              <div className = "text-white">
                <label htmlFor="judul" className='text-white'>Judul Tugas</label>
                <input type="text" id="judul" name="judul" placeholder='Contoh: Belajar Matematika' className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
              </div>
              <div className = "text-white">
                <label htmlFor="deskripsi" className='text-white'>Deskripsi Tugas</label>
                <input type="text" id="deskripsi" name="deskripsi" placeholder='Contoh: Selesaikan halaman 10-15' className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
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
    </>
  )
}

export default App
