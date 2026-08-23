import { useState } from 'react';
import './components/Navbar.jsx';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Recap from './components/Recap.jsx';
import MainList from './components/MainList.jsx';
import listIcon from './assets/list.png'
import RecapDesktop from './components/recapDekstop.jsx';

function App() {

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState('Semua');
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const openAddTask = () => {
    setEditingTaskId(null);
    setNewTask({ title: '', description: '', deadline: '' });
    setAddIsOpen(true);
  };

  const handleSaveTask = (event) => {
    event.preventDefault();

    setTasks((currentTasks) => editingTaskId === null
      ? [...currentTasks, { id: Date.now(), ...newTask }]
      : currentTasks.map((task) => (
        task.id === editingTaskId ? { ...task, ...newTask } : task
      ))
    );
    setNewTask({ title: '', description: '', deadline: '' });
    setEditingTaskId(null);
    setAddIsOpen(false);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
    });
    setAddIsOpen(true);
  };

  return (
    <div className="lg:px-8">

      <Navbar/>
      <div className = 'lg:hidden'>
        <Recap setAddIsOpen={openAddTask}  />
      </div>
      <div className="hidden lg:block">
        <RecapDesktop setAddIsOpen={openAddTask} />
      </div>
      

      {/* section daftar tugas */}
      <div className='py-3 flex justify-between'>
        <div id="judul-list " className='flex'>
          <img src={listIcon} alt=""  className='w-5 h-5 brightness-0 invert mt-1'/>
          <h2 className='text-white font-semibold px-3 text-xl md:text-2xl'>Daftar Tugas</h2>
        </div>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className='text-white bg-[#0b0a18] w-25 h-8 text-sm rounded-lg flex justify-between items-center hover:bg-[#853dfa] md:w-35 md:h-10 md:text-xl' ><span className='mx-auto'>{filter}</span> <span className='mx-auto'>⬇️</span></button>
        
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

      
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5'>
        {tasks.map((task) => (
          <MainList key={task.id} task={task} onEdit={handleEditTask}/>
        ))}
      </div>


      {/* fitur pop up form tambah tugas */}
      {addIsOpen && (
        <div className="popup fixed inset-0 z-50 flex items-center justify-center bg-black/60 w-full">
          <form onSubmit={handleSaveTask} className = "bg-[#853dfa] w-[90%] max-w-[360px] h-75 rounded-xl p-4 flex flex-col items-center justify-center md:max-w-none md:w-[550px] md:h-90">
            <div className='flex items-center justify-between  w-full '>
              <h2 className='text-white text-lg font-semibold ml-20 '>{editingTaskId === null ? 'Tambah Tugas' : 'Edit Tugas'}</h2>
              <button type="button" className='text-white text-lg font-semibold ml-20' onClick={() => {
                setAddIsOpen(false);
                setEditingTaskId(null);
              }}>X</button>
            </div>
            <div className="form flex flex-col w-full ">
              <div className = "text-white">
                <label htmlFor="judul" className='text-white'>Judul Tugas</label>
                <input required type="text" id="judul" name="judul" value={newTask.title} onChange={(event) => setNewTask({ ...newTask, title: event.target.value })} placeholder='Contoh: Belajar Matematika' className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
              </div>
              <div className = "text-white">
                <label htmlFor="deskripsi" className='text-white'>Deskripsi Tugas</label>
                <input required type="text" id="deskripsi" name="deskripsi" value={newTask.description} onChange={(event) => setNewTask({ ...newTask, description: event.target.value })} placeholder='Contoh: Selesaikan halaman 10-15' className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
              </div>
              <div className = "text-white">
                <label htmlFor="deadline" className='text-white'>Deadline</label>
                <input required type="date" id="deadline" name="deadline" value={newTask.deadline} onChange={(event) => setNewTask({ ...newTask, deadline: event.target.value })} className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
              </div>
            </div>
            <button type="submit" className='bg-[#2e1757] text-white py-1 w-75 mx-auto mt-4 rounded-xl font-medium'>Simpan</button>
          </form>

        </div>
      )}
    </div>
  )
}

export default App
