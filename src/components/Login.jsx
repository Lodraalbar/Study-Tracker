import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, form.email, form.password);
      } else {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      }
    } catch (firebaseError) {
      const messages = {
        'auth/email-already-in-use': 'Email sudah terdaftar. Silakan login.',
        'auth/invalid-credential': 'Email atau password salah.',
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/weak-password': 'Password harus minimal 6 karakter.',
      };
      setError(messages[firebaseError.code] || 'Terjadi kesalahan. Coba lagi.');
    }
  };

  return (
    <main className="min-h-screen bg-[#151326] flex items-center justify-center px-5 py-10">
      <section className="w-full max-w-md rounded-2xl bg-[#0b0a18] border border-[#853dfa] p-7 text-white shadow-xl">
        <p className="text-sm text-[#b99cff] mb-2">Study Tracker</p>
        <h1 className="text-3xl font-bold mb-2">{mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru'}</h1>
        <p className="text-sm text-gray-400 mb-7">
          {mode === 'login' ? 'Login untuk melanjutkan belajar.' : 'Daftar untuk mulai mencatat tugasmu.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm({ ...form, email: event.target.value });
                setError('');
              }}
              className="rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]"
              placeholder="nama@email.com"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Password
            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(event) => {
                setForm({ ...form, password: event.target.value });
                setError('');
              }}
              className="rounded-lg bg-[#151326] border border-gray-700 px-3 py-2 outline-none focus:border-[#853dfa]"
              placeholder="Minimal 6 karakter"
            />
          </label>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button type="submit" className="rounded-lg bg-[#853dfa] py-2 font-semibold hover:bg-white hover:text-[#853dfa] transition-colors">
            {mode === 'login' ? 'Login' : 'Daftar'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
          className="mt-5 w-full text-sm text-[#c8b2ff] hover:text-white"
        >
          {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
        </button>
      </section>
    </main>
  );
};

export default Login;
