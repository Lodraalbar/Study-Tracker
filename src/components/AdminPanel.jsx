import { useEffect, useMemo, useState } from 'react';
import { deleteDoc, doc, getDoc, onSnapshot, collection, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { AlertTriangle, CheckCircle2, ListChecks, LogOut, Mail, Search, Users, X } from 'lucide-react';
import { auth, db } from '../firebase';
import { cloneTheme, DEFAULT_THEME, THEME_FIELDS } from '../theme';

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

function StatCard({ label, value, accent, icon: Icon }) {
  return <article className="rounded-xl border border-white/10 bg-[#17152b] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:p-4">
    <div className="flex items-start justify-between gap-2"><p className="text-[11px] text-gray-400 sm:text-xs">{label}</p>{Icon && <Icon size={15} className={accent || 'text-gray-300'} />}</div>
    <p className={`mt-2 text-xl font-semibold tracking-tight sm:text-2xl ${accent || 'text-white'}`}>{value}</p>
  </article>;
}

function ThemeEditor() {
  const [theme, setTheme] = useState(() => cloneTheme(DEFAULT_THEME));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'settings', 'theme')).then((snapshot) => {
      if (snapshot.exists()) {
        const savedTheme = snapshot.data();
        setTheme({
          dark: { ...DEFAULT_THEME.dark, ...(savedTheme.dark || {}) },
          light: { ...DEFAULT_THEME.light, ...(savedTheme.light || {}) },
        });
      }
    });
  }, []);

  const updateColor = (mode, key, value) => {
    setTheme((current) => ({ ...current, [mode]: { ...current[mode], [key]: value } }));
    setMessage('');
  };

  const saveTheme = async () => {
    setSaving(true);
    setMessage('');
    try {
      await setDoc(doc(db, 'settings', 'theme'), theme);
      setMessage('Tema tersimpan. Refresh halaman user untuk melihat perubahan.');
    } catch {
      setMessage('Tema gagal disimpan. Periksa rules Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const resetTheme = async () => {
    if (!window.confirm('Kembalikan semua warna ke default?')) return;
    const defaultTheme = cloneTheme(DEFAULT_THEME);
    setTheme(defaultTheme);
    await setDoc(doc(db, 'settings', 'theme'), defaultTheme);
    setMessage('Warna default dipulihkan.');
  };

  return <section className="mt-5 rounded-xl border border-white/10 bg-[#141226] p-4 sm:p-5">
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-base font-semibold">Warna aplikasi</h2><p className="mt-0.5 text-[11px] text-gray-500">Atur tema dark dan light. Perubahan berlaku setelah refresh.</p></div><div className="flex gap-2"><button onClick={resetTheme} className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-gray-300 hover:bg-white/10">Reset default</button><button onClick={saveTheme} disabled={saving} className="rounded-lg bg-[#853dfa] px-3 py-2 text-[11px] font-medium disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan tema'}</button></div></div>
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {['dark', 'light'].map((mode) => <div key={mode} className="rounded-lg border border-white/10 bg-black/10 p-3"><p className="text-xs font-semibold capitalize">Mode {mode}</p><div className="mt-3 grid grid-cols-2 gap-2">{THEME_FIELDS.map(({ key, label }) => <label key={key} className="flex min-w-0 items-center gap-2 rounded-md bg-black/10 p-1.5"><input type="color" value={theme[mode][key]} onChange={(event) => updateColor(mode, key, event.target.value)} className="h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0" /><span className="min-w-0"><span className="block truncate text-[10px] text-gray-400">{label}</span><input value={theme[mode][key]} onChange={(event) => updateColor(mode, key, event.target.value)} className="w-full min-w-0 bg-transparent text-[10px] text-white outline-none" /></span></label>)}</div></div>)}
    </div>
    {message && <p className="mt-3 text-xs text-emerald-300">{message}</p>}
  </section>;
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
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const taskCountForUser = (userId) => tasks.filter((task) => task.userId === userId).length;
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

  return <main className="min-h-screen max-w-full overflow-x-hidden bg-[#0e0d1d] px-4 py-4 text-white sm:px-6 sm:py-6 md:px-10">
    <header className="mx-auto flex max-w-7xl items-center justify-between rounded-xl border border-white/10 bg-[#141226] px-4 py-3 shadow-lg">
      <div><p className="text-[11px] font-medium text-[#b99cff]">STUDY TRACKER / ADMIN</p><h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Overview</h1></div>
      <button onClick={onLogout} className="flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-2 text-xs transition-colors hover:bg-white/10"><LogOut size={14} />Keluar</button>
    </header>
    <section className="mx-auto mt-4 grid max-w-7xl grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
      <StatCard label="Total user" value={users.length} accent="text-[#c8b2ff]" icon={Users} />
      <StatCard label="Total tugas" value={tasks.length} icon={ListChecks} />
      <StatCard label="Selesai" value={`${completionRate}%`} accent="text-emerald-300" icon={CheckCircle2} />
      <StatCard label="Terlambat" value={overdueTasks} accent="text-red-300" icon={AlertTriangle} />
    </section>
    {notice && <p className="mx-auto mt-5 max-w-7xl break-words rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}
    <ThemeEditor />
    <section className="mx-auto mt-5 grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6">
      <div className="rounded-xl border border-white/10 bg-[#141226] p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold">Users</h2><p className="mt-0.5 text-[11px] text-gray-500">Pilih user untuk melihat tugas</p></div><span className="rounded-full bg-white/5 px-2 py-1 text-[11px] text-gray-400">{filteredUsers.length}</span></div>
        <div className="relative mb-3"><Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input value={search} onChange={(event) => { setSearch(event.target.value); setSelectedUserId(null); }} placeholder="Cari email user..." className="w-full rounded-lg border border-white/10 bg-[#0e0d1d] py-2.5 pl-9 pr-8 text-xs outline-none focus:border-[#853dfa]" />{search && <button onClick={() => { setSearch(''); setSelectedUserId(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><X size={14} /></button>}</div>
        <div className="max-h-[360px] space-y-1.5 overflow-y-auto sm:max-h-[460px]">
          {filteredUsers.map((user) => <div key={user.id} className={`rounded-lg border p-2.5 transition-colors ${selectedUserId === user.id ? 'border-[#853dfa] bg-[#241743]' : 'border-white/10 bg-white/[0.015]'}`}><button onClick={() => setSelectedUserId(user.id)} className="w-full text-left"><p className="flex items-center gap-1.5 truncate text-xs font-medium"><Mail size={13} className="shrink-0 text-[#b99cff]" />{user.email || 'Email belum tersedia'}</p><p className="mt-1 text-[10px] text-gray-500">{taskCountForUser(user.id)} tugas · {formatDate(user.createdAt?.toDate?.() || user.createdAt)}</p></button><div className="mt-2 border-t border-white/10 pt-1.5 text-right"><button onClick={() => resetPassword(user.email)} className="text-[10px] text-[#c8b2ff] hover:text-white">Reset password</button></div></div>)}
          {!filteredUsers.length && <p className="py-8 text-center text-sm text-gray-500">Belum ada data user.</p>}
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#141226] p-4 sm:p-5">
        <div className="mb-3 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><h2 className="truncate text-base font-semibold">{selectedUser ? `Tugas ${selectedUser.email}` : 'Semua tugas'}</h2>{selectedUser && <button onClick={() => setSelectedUserId(null)} className="mt-1 text-[11px] text-[#c8b2ff]">Tampilkan semua tugas</button>}</div><div className="flex flex-wrap gap-1.5"><button onClick={() => setTaskFilter('all')} className={`rounded-full px-2.5 py-1 text-[10px] ${taskFilter === 'all' ? 'bg-[#853dfa] text-white' : 'bg-white/5 text-gray-400'}`}>Semua</button><button onClick={() => setTaskFilter('completed')} className={`rounded-full px-2.5 py-1 text-[10px] ${taskFilter === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-gray-400'}`}>Selesai</button><button onClick={() => setTaskFilter('pending')} className={`rounded-full px-2.5 py-1 text-[10px] ${taskFilter === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-gray-400'}`}>Aktif</button><button onClick={() => setTaskFilter('overdue')} className={`rounded-full px-2.5 py-1 text-[10px] ${taskFilter === 'overdue' ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-gray-400'}`}>Terlambat</button></div></div>
        <div className="max-w-full overflow-hidden"><table className="w-full table-fixed text-left text-xs"><thead className="border-b border-white/10 text-[10px] uppercase text-gray-500"><tr><th className="w-[38%] py-2.5">Tugas</th><th className="hidden w-[27%] sm:table-cell">Pemilik</th><th className="w-[24%]">Deadline</th><th className="w-[23%]">Status</th><th className="w-[15%]" /></tr></thead><tbody>{filteredTasks.map((task) => <tr key={task.id} className="border-b border-white/5"><td className="max-w-0 truncate py-2.5 pr-1 font-medium">{task.title}</td><td className="hidden max-w-0 truncate text-gray-400 sm:table-cell">{userById.get(task.userId)?.email || task.userId}</td><td className="truncate whitespace-nowrap pr-1 text-[10px] text-gray-400">{formatDate(task.deadline)}</td><td className="truncate"><span className={task.completed ? 'text-emerald-300' : 'text-amber-300'}>{task.completed ? 'Selesai' : 'Aktif'}</span></td><td className="text-right"><button onClick={() => removeTask(task.id)} className="text-red-300 hover:text-red-100">Hapus</button></td></tr>)}</tbody></table>{!filteredTasks.length && <p className="py-8 text-center text-xs text-gray-500">Tidak ada tugas yang cocok.</p>}</div>
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
