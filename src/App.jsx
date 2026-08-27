import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import './components/Navbar.jsx';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Recap from './components/Recap.jsx';
import MainList from './components/MainList.jsx';
import listIcon from './assets/list.png'
import RecapDesktop from './components/recapDekstop.jsx';
import Login from './components/Login.jsx';
import { auth, db } from './firebase';

function App() {

  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('study-tracker-theme') || 'dark');
  const [authLoading, setAuthLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState('Semua');
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    reminderMinutes: 30,
  });

  const openAddTask = () => {
    setEditingTaskId(null);
    setNewTask({ title: '', description: '', deadline: '', reminderMinutes: 30 });
    setAddIsOpen(true);
  };

  useEffect(() => onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);
  }), []);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    return onSnapshot(tasksQuery, (snapshot) => {
      setTasks(snapshot.docs.map((taskDoc) => ({ id: taskDoc.id, ...taskDoc.data() })));
    });
  }, [user]);

  const handleLogout = () => signOut(auth);

  const handleThemeToggle = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('study-tracker-theme', nextTheme);
      return nextTheme;
    });
  };

  const handleSaveTask = async (event) => {
    event.preventDefault();
    const taskData = {
      ...newTask,
      deadline: new Date(newTask.deadline).toISOString(),
      notificationSent: false,
    };

    if (editingTaskId === null) {
      await addDoc(collection(db, 'tasks'), { ...taskData, completed: false, userId: user.uid });
    } else {
      await updateDoc(doc(db, 'tasks', editingTaskId), taskData);
    }
    setNewTask({ title: '', description: '', deadline: '', reminderMinutes: 30 });
    setEditingTaskId(null);
    setAddIsOpen(false);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      reminderMinutes: task.reminderMinutes ?? 30,
    });
    setAddIsOpen(true);
  };

  const handleDeleteTask = (taskId) => deleteDoc(doc(db, 'tasks', taskId));

  const handleToggleTask = (taskId, completed) => updateDoc(doc(db, 'tasks', taskId), { completed });

  const completedTasks = tasks.filter((task) => task.completed);
  const currentDate = new Date();
  const today = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, '0'),
    String(currentDate.getDate()).padStart(2, '0'),
  ].join('-');
  const todayTasks = tasks.filter((task) => task.deadline?.split('T')[0] === today);
  const todayLabel = currentDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const recap = {
    total: tasks.length,
    completed: completedTasks.length,
    incomplete: tasks.length - completedTasks.length,
    today: todayTasks.length,
  };
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'Selesai') return task.completed;
    if (filter === 'Belum Selesai') return !task.completed;
    if (filter === 'Tugas Hari Ini') return task.deadline?.split('T')[0] === today;
    return true;
  });
  const deadlineNotifications = tasks
    .filter((task) => !task.completed && task.deadline)
    .map((task) => ({
      ...task,
      minutesLeft: Math.round((new Date(task.deadline).getTime() - currentTime.getTime()) / 60000),
    }))
    .filter((task) => task.minutesLeft >= 0 && task.minutesLeft <= Number(task.reminderMinutes ?? 30))
    .sort((first, second) => first.minutesLeft - second.minutesLeft);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    deadlineNotifications.forEach((task) => {
      const notificationKey = `deadline-notified-${user.uid}-${task.id}-${task.deadline}-${task.reminderMinutes}`;
      if (localStorage.getItem(notificationKey)) return;

      new Notification(`Deadline mendekat: ${task.title}`, {
        body: task.minutesLeft === 0 ? 'Deadline tugasmu sekarang.' : `${task.minutesLeft} menit lagi menuju deadline.`,
      });
      localStorage.setItem(notificationKey, 'true');
    });
  }, [deadlineNotifications, user, currentTime]);

  if (authLoading) {
    return <div className="min-h-screen bg-[#151326] flex items-center justify-center text-white">Memuat...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className={`app-shell ${theme === 'light' ? 'theme-light' : 'theme-dark'} lg:px-8`}>

      <Navbar onLogout={handleLogout} theme={theme} onThemeToggle={handleThemeToggle} notifications={deadlineNotifications}/>
      <div className = 'lg:hidden'>
        <Recap setAddIsOpen={openAddTask} recap={recap} todayLabel={todayLabel} currentTime={currentTime} />
      </div>
      <div className="hidden lg:block">
        <RecapDesktop setAddIsOpen={openAddTask} recap={recap} todayLabel={todayLabel} currentTime={currentTime} />
      </div>
      

      {/* section daftar tugas */}
      <div className='py-3 flex justify-between'>
        <div id="judul-list " className='flex'>
          <img src={listIcon} alt=""  className='w-5 h-5 brightness-0 invert mt-1'/>
          <h2 className='text-white font-semibold px-3 text-xl md:text-2xl lg:text-xl'>Daftar Tugas</h2>
        </div>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className='text-white bg-[#0b0a18] w-25 h-8 text-sm rounded-lg flex justify-between items-center border-2 border-[#853dfa] hover:bg-[#853dfa] md:w-35  md:h-10 md:text-xl lg:w-25 lg:h-7 lg:text-[14px]' ><span className='mx-auto text-[10px] px-[3px]'>{filter}</span> <span className='mx-auto'>⬇️</span></button>
        
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
        {visibleTasks.map((task) => (
          <MainList key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} onToggle={handleToggleTask}/>
        ))}
      </div>


      {/* fitur pop up form tambah tugas */}
      {addIsOpen && (
        <div className="popup fixed inset-0 z-50 flex items-center justify-center bg-black/60 w-full">
          <form onSubmit={handleSaveTask} className = "bg-[#853dfa] w-[90%] max-w-[360px] h-95 rounded-xl p-4 flex flex-col items-center justify-center md:max-w-none md:w-[550px] md:h-90">
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
                <div className="flex gap-2">
                  <input required type="date" id="deadline" name="deadline" value={newTask.deadline.split('T')[0] || ''} onChange={(event) => setNewTask({ ...newTask, deadline: `${event.target.value}T${newTask.deadline.split('T')[1] || '23:59'}` })} className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
                  <input required type="time" aria-label="Jam deadline" value={newTask.deadline.split('T')[1] || ''} onChange={(event) => setNewTask({ ...newTask, deadline: `${newTask.deadline.split('T')[0] || today}T${event.target.value}` })} className='w-32 mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
                </div>
              </div>
              <div className="text-white">
                <label htmlFor="reminder" className='text-white'>Ingatkan saya</label>
                <div className="flex gap-2">
                  <input required min="1" type="number" id="reminder" value={newTask.reminderMinutes >= 60 && newTask.reminderMinutes % 60 === 0 ? newTask.reminderMinutes / 60 : newTask.reminderMinutes} onChange={(event) => setNewTask({ ...newTask, reminderMinutes: Number(event.target.value) * (newTask.reminderMinutes >= 60 && newTask.reminderMinutes % 60 === 0 ? 60 : 1) })} className='w-full mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]' />
                  <select aria-label="Satuan pengingat" value={newTask.reminderMinutes >= 60 && newTask.reminderMinutes % 60 === 0 ? 'hours' : 'minutes'} onChange={(event) => setNewTask({ ...newTask, reminderMinutes: event.target.value === 'hours' ? 1 : 30 })} className='w-32 mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]'>
                    <option value="minutes">Menit</option>
                    <option value="hours">Jam</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className='bg-[#2e1757] text-white py-1 w-75 mx-auto mt-4 rounded-xl font-medium'>Simpan</button>
          </form>

        </div>
      )}
      <footer className="mt-12 border-t border-gray-700 py-5 text-center text-sm text-gray-400">
        Copyright © 2026 Lodra. All rights reserved. Instagram: <a href="https://www.instagram.com/kalimasada._17/" className="text-[#853dfa] hover:text-white"> @kalimasada._17</a>
      </footer>
    </div>
  )
}

export default App
