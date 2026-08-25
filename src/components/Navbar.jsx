import { Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";
import  calendarIcon  from "../assets/calendar.png";
import taskIcon from "../assets/clipboard.png";
import dataIcon from "../assets/data.png"
import '../App.css'


const Navbar = ({ onLogout, theme, onThemeToggle }) => {

    const [isOpen, setIsOpen] = useState(false);
    return (
    <div className="navbar flex items-center border-b sticky top-0 z-50 pb-2">
        <div className="Burger-icon text-3xl lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>☰</button>
                                                 
        </div>
        <div className="logo font-bold text-3xl ml-6 font-poppins lg:ml-0">
            <h1>Study <span className="text-accent">Tracker</span></h1>
        </div>
        <ul className="hidden lg:flex items-center gap-8 ml-12 font-medium">
            <li><a href="#tugas" className="nav-link">Tugas</a></li>
            <li><a href="#overview" className="nav-link">Overview</a></li>
            <li><a href="#kalender" className="nav-link">Kalender</a></li>
        </ul>
        <div className="Notification-Logo ml-auto flex items-center">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} desktop />
            <button className="icon-button translate-y-2"><Bell size={24}></Bell></button>
            <button onClick={onLogout} className="logout-button ml-4 text-sm rounded-[2px] font-semibold text-[13px] p-[2px] md:p-[10px]">Logout</button>
        </div>

        {/* navbar side */}
        
        <aside className={`mobile-menu fixed top-19 left-0 h-screen w-60 z-50 flex flex-col items-center border-l border-t border-3 transition-transform duration-300 lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <h2 className="text-3xl font-bold items-center text-center mt-8">MENU</h2>
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <ul className="font-medium text-2xl flex flex-col gap-8 p-3 mt-8">
                <li className="flex "><img src={taskIcon} alt="" srcset="" className="h-8 w-8 brightness-0 invert" /><a href="" className="px-4 hover:text-black">Tugas</a></li>
                <li className="flex "><img src={dataIcon} alt="" srcset="" className="h-8 w-8 brightness-0 invert" /><a href="" className="px-4 hover:text-black">Overview</a></li>
                <li className="flex "><img src={calendarIcon} alt="" srcset="" className="h-8 w-8 brightness-0 invert" /><a href="" className="px-4 hover:text-black">Kalender</a></li>
            </ul>
            <p className="mt-auto mb-20 px-4 text-center text-xs text-muted font-sans">
                Copyright © 2026 Lodra. All rights reserved. Instagram:
                <a href="https://www.instagram.com/kalimasada._17/" className="text-accent hover:text-strong"> @kalimasada._17</a>
            </p>
        </aside>
        
        
            
    </div>

    )
}

const ThemeToggle = ({ theme, onToggle, desktop = false }) => {
    const isLight = theme === 'light';

    return (
        <button
            type="button"
            aria-label={`Aktifkan tema ${isLight ? 'gelap' : 'terang'}`}
            aria-pressed={isLight}
            title={`Tema ${isLight ? 'terang' : 'gelap'}`}
            onClick={onToggle}
            className={`theme-toggle ${desktop ? 'theme-toggle-desktop' : ''}`}
        >
            <span className={`theme-toggle-icon ${isLight ? 'is-active' : ''}`}><Sun size={14} /></span>
            <span className={`theme-toggle-icon ${!isLight ? 'is-active' : ''}`}><Moon size={14} /></span>
        </button>
    );
};

export default Navbar;
