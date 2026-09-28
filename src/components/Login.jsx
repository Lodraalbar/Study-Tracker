import { useState } from 'react';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      if (mode === 'register') {
        const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await setDoc(doc(db, 'users', credential.user.uid), {
          email: credential.user.email,
          createdAt: serverTimestamp(),
        });
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

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!form.email) {
      setError('Masukkan email terlebih dahulu.');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, form.email);
      setMessage('Link reset password sudah dikirim. Periksa inbox atau folder spam email kamu.');
    } catch (firebaseError) {
      const messages = {
        'auth/invalid-email': 'Format email tidak valid.',
        'auth/user-not-found': 'Email tersebut belum terdaftar.',
      };
      setError(messages[firebaseError.code] || 'Link reset password gagal dikirim. Coba lagi.');
    } finally {
      setResetLoading(false);
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
          {mode === 'login' && (
            <button type="button" onClick={handleForgotPassword} disabled={resetLoading} className="self-end text-sm text-[#c8b2ff] hover:text-white disabled:opacity-60">
              {resetLoading ? 'Mengirim link...' : 'Lupa password?'}
            </button>
          )}
          {error && <p className="text-sm text-red-300">{error}</p>}
          {message && <p className="text-sm text-emerald-300">{message}</p>}
          <button type="submit" className="rounded-lg bg-[#853dfa] py-2 font-semibold hover:bg-white hover:text-[#853dfa] transition-colors">
            {mode === 'login' ? 'Login' : 'Daftar'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
            setMessage('');
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
