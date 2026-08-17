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
  return (
    <>

      <Navbar/>
      <Recap/>
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
      <MainList/>

    </>
  )
}

export default App
