import { Bell } from "lucide-react";
import { useState } from "react";
import  calendarIcon  from "../assets/calendar.png";
import taskIcon from "../assets/clipboard.png";
import dataIcon from "../assets/data.png"
import '../App.css'


const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false);
    return (
    <div className="flex items-center border-white border-b sticky top-0 z-50 pb-2">
        <div className="Burger-icon text-3xl text-white">
            <button onClick={() => setIsOpen(!isOpen)}>☰</button>
                                                 
        </div>
        <div className="logo text-white font-bold text-3xl ml-6 font-poppins">
            <h1>Study <span className="text-[#853dfa]">Tracker</span></h1>
        </div>
        <div className="Notification-Logo ml-auto ">
            <button className="text-white hover:text-[#853dfa] mt-3"><Bell size={24}></Bell></button>
        </div>

        {/* navbar side */}
        
        <aside className={`fixed top-19 left-0 h-screen w-60 z-50 bg-[#853dfa] items-center border-l border-t border-3 border-white transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <h2 className="text-3xl font-medium text-white font-bold items-center text-center mt-8 hover:text-black ">MENU</h2>
            <ul className="text-white font-medium text-2xl flex flex-col gap-8 p-3  mt-10">
                <li className="flex "><img src={taskIcon} alt="" srcset="" className="h-8 w-8 brightness-0 invert" /><a href="" className="px-4 hover:text-black">Tugas</a></li>
                <li className="flex "><img src={dataIcon} alt="" srcset="" className="h-8 w-8 brightness-0 invert" /><a href="" className="px-4 hover:text-black">Overview</a></li>
                <li className="flex "><img src={calendarIcon} alt="" srcset="" className="h-8 w-8 brightness-0 invert" /><a href="" className="px-4 hover:text-black">Kalender</a></li>
            </ul>
        </aside>
        
        
            
    </div>

    )
}

export default Navbar;
