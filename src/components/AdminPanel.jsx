import { useEffect, useMemo, useState } from 'react';
import { deleteDoc, doc, onSnapshot, collection } from 'firebase/firestore';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';

const ADMIN_EMAIL = 'lodrakepow3@gmail.com';

const formatDate = (value) => value ? new Date(value).toLocaleDateString('id-ID', {
  day: 'numeric', month: 'short', year: 'numeric',
}) : '-';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (username.trim().toLowerCase() !== 'admin') throw new Error('Nama pengguna admin tidak valid.');
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    } catch (loginError) {
      setError(loginError.message.includes('valid') ? loginError.message : 'Login gagal. Pastikan akun admin sudah dibuat di Firebase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#151326] flex items-center justify-center px-5 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-[#0b0a18] border border-[#853dfa] p-8 shadow-xl">
        <p className="text-sm text-[#b99cff]">Study Tracker</p>
        <h1 className="mt-2 text-3xl font-bold">Admin panel</h1>
        <p className="mt-2 mb-7 text-sm text-gray-400">Masuk untuk memantau user dan tugas.</p>
        <label className="flex flex-col gap-1 text-sm">Username
          <input required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]" placeholder="admin" />
        </label>
        <label className="mt-4 flex flex-col gap-1 text-sm">Password
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]" placeholder="admin123" />
        </label>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-[#853dfa] py-2 font-semibold disabled:opacity-60">{loading ? 'Memeriksa...' : 'Masuk sebagai admin'}</button>
        <p className="mt-4 text-xs text-gray-500">Akun Firebase: {ADMIN_EMAIL}</p>
      </form>
    </main>
  );
}

function StatCard({ label, value, accent }) {
  return <article className="rounded-xl border border-white/10 bg-[#17152b] p-5">
    <p className="text-sm text-gray-400">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${accent || 'text-white'}`}>{value}</p>
  </article>;
}

function AdminDashboard({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    const unsubscribeTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      setTasks(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    return () => {
      unsubscribeUsers();
      unsubscribeTasks();
    };
  }, []);

  const userById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const selectedUser = selectedUserId ? userById.get(selectedUserId) : null;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const overdueTasks = tasks.filter((task) => !task.completed && task.deadline && new Date(task.deadline) < new Date()).length;
  const filteredUsers = users.filter((user) => user.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredTasks = tasks.filter((task) => {
    const belongsToSelectedUser = !selectedUserId || task.userId === selectedUserId;
    if (taskFilter === 'completed') return belongsToSelectedUser && task.completed;
    if (taskFilter === 'pending') return belongsToSelectedUser && !task.completed;
    if (taskFilter === 'overdue') return belongsToSelectedUser && !task.completed && task.deadline && new Date(task.deadline) < new Date();
    return belongsToSelectedUser;
  });

  const removeTask = async (taskId) => {
    if (!window.confirm('Hapus tugas ini?')) return;
    await deleteDoc(doc(db, 'tasks', taskId));
    setNotice('Tugas berhasil dihapus.');
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
    setNotice(`Link reset password dikirim ke ${email}.`);
  };

  return <main className="min-h-screen bg-[#0e0d1d] px-5 py-7 text-white md:px-10">
    <header className="mx-auto flex max-w-7xl items-center justify-between">
      <div><p className="text-sm text-[#b99cff]">Study Tracker / Admin</p><h1 className="mt-1 text-3xl font-bold">Overview</h1></div>
      <button onClick={onLogout} className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/10">Keluar</button>
    </header>
    <section className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Total user" value={users.length} accent="text-[#c8b2ff]" />
      <StatCard label="Total tugas" value={tasks.length} />
      <StatCard label="Tugas selesai" value={completedTasks} accent="text-emerald-300" />
      <StatCard label="Deadline terlewat" value={overdueTasks} accent="text-red-300" />
    </section>
    {notice && <p className="mx-auto mt-5 max-w-7xl rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}
    <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-xl border border-white/10 bg-[#141226] p-5">
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">Users</h2><span className="text-xs text-gray-400">{filteredUsers.length} akun</span></div>
        <input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedUserId(null); }} placeholder="Cari email..." className="mb-4 w-full rounded-lg border border-white/10 bg-[#0e0d1d] px-3 py-2 text-sm outline-none focus:border-[#853dfa]" />
        <div className="max-h-[460px] space-y-2 overflow-y-auto">
          {filteredUsers.map((user) => <div key={user.id} className={`rounded-lg border p-3 transition-colors ${selectedUserId === user.id ? 'border-[#853dfa] bg-[#241743]' : 'border-white/10'}`}><button onClick={() => setSelectedUserId(user.id)} className="w-full text-left"><p className="truncate text-sm">{user.email || 'Email belum tersedia'}</p><p className="mt-1 text-xs text-[#b99cff]">Lihat tugas user ini</p></button><div className="mt-2 flex items-center justify-between text-xs text-gray-500"><span>{formatDate(user.createdAt?.toDate?.() || user.createdAt)}</span><button onClick={() => resetPassword(user.email)} className="text-[#c8b2ff] hover:text-white">Reset password</button></div></div>)}
          {!filteredUsers.length && <p className="py-8 text-center text-sm text-gray-500">Belum ada data user.</p>}
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#141226] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{selectedUser ? `Tugas ${selectedUser.email}` : 'Semua tugas'}</h2>{selectedUser && <button onClick={() => setSelectedUserId(null)} className="mt-1 text-xs text-[#c8b2ff] hover:text-white">Tampilkan semua tugas</button>}</div><select value={taskFilter} onChange={(event) => setTaskFilter(event.target.value)} className="rounded-lg border border-white/10 bg-[#0e0d1d] px-3 py-2 text-sm"><option value="all">Semua status</option><option value="completed">Selesai</option><option value="pending">Belum selesai</option><option value="overdue">Terlambat</option></select></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[580px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase text-gray-500"><tr><th className="py-3">Tugas</th><th>Pemilik</th><th>Deadline</th><th>Status</th><th /></tr></thead><tbody>{filteredTasks.map((task) => <tr key={task.id} className="border-b border-white/5"><td className="max-w-[180px] truncate py-3">{task.title}</td><td className="max-w-[170px] truncate text-gray-400">{userById.get(task.userId)?.email || task.userId}</td><td className="text-gray-400">{formatDate(task.deadline)}</td><td><span className={task.completed ? 'text-emerald-300' : 'text-amber-300'}>{task.completed ? 'Selesai' : 'Aktif'}</span></td><td><button onClick={() => removeTask(task.id)} className="text-red-300 hover:text-red-100">Hapus</button></td></tr>)}</tbody></table>{!filteredTasks.length && <p className="py-8 text-center text-sm text-gray-500">Tidak ada tugas yang cocok.</p>}</div>
      </div>
    </section>
  </main>;
}

export default function AdminPanel() {
  const [user, setUser] = useState(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  const logout = () => signOut(auth);
  if (user === undefined) return <div className="min-h-screen bg-[#151326]" />;
  if (!user || user.email !== ADMIN_EMAIL) return <AdminLogin />;
  return <AdminDashboard onLogout={logout} />;
}
