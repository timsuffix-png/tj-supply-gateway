"use client";

import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Footer from "../footer";
import SubmitButton from "../submitButton";
import { useAuth } from "../auth/authProvider";
import Index from ".";
import APISetting from "./apiSetting";
import Popup from "./popup";

export default function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const ironsImageRef = useRef(null);
  const logoImageRef = useRef(null);
  const auth = useAuth();
  const [apiPopup, setApiPopup] = useState(false);
  const openPopup = () => setApiPopup(true);
  const closePopup = () => setApiPopup(false);

  useEffect(() => {
    if (ironsImageRef.current && logoImageRef.current) {
      const loadImage = async () => {
        const irons = await window.electronAPI.loadImg("irons.png");
        const logo = await window.electronAPI.loadImg("logo.png");
        try {
          ironsImageRef.current.src = irons;
          logoImageRef.current.src = logo;
        } catch {}
      };
      loadImage();
    }
  }, [auth]);

  const fetchData = async () => {
    try {
      await auth.handleLogin({ username, password });
      Swal.fire({
        title: "Login success",
        position: "bottom-end",
        timer: 1000,
        showConfirmButton: false,
        icon: "success",
        width: "20rem",
      });
    } catch (err) {
      Swal.fire({
        title: "Login failed",
        position: "bottom-end",
        timer: 1000,
        showConfirmButton: false,
        icon: "error",
        width: "20rem",
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  if (!auth.user?.data)
    return (
      <div className="w-screen h-screen relative bg-white">
        <div className="w-[579px] h-[579px] left-[384px] top-[253px] absolute bg-white rounded-[15px] border-2 border-black"></div>
        <img
          className="w-auto h-screen right-[0px] top-0 absolute"
          ref={ironsImageRef}
          width={571}
          height={945}
          alt="irons"
        />
        <div className="w-auto h-auto left-[445px] top-[274px] absolute text-center">
          <span className="text-black text-[32px] font-bold font-['Sarabun']">
            ยินดีต้อนรับสู่ระบบจัดการคลังสินค้า
            <br />
            <br />
          </span>
          <span className="text-black text-2xl font-bold font-['Sarabun']">
            ลงชื่อเข้าใช้บัญชีของคุณ
          </span>
        </div>
        <img
          className="w-[254px] h-[60px] left-[80px] top-[80px] absolute"
          ref={logoImageRef}
          width={254}
          height={60}
          alt="logo"
        />
        <div className="w-[118px] h-[49px] left-[452px] top-[444px] absolute text-left text-black text-xl font-normal font-['Sarabun']">
          ชื่อผู้ใช้งาน
        </div>
        <div className="w-[118px] h-[49px] left-[452px] top-[559px] absolute text-left text-black text-xl font-normal font-['Sarabun']">
          รหัสผ่าน
        </div>
        <div className="w-[441px] h-[50px] left-[452px] top-[493px] absolute">
          <input
            className="w-[441px] h-[50px] left-0 top-0 absolute bg-white rounded-md border border-black text-black text-2xl px-3 font-normal font-['Sarabun']"
            type="text"
            placeholder="ชื่อผู้ใช้งาน"
            onChange={(e) => setusername(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="w-[441px] h-[50px] left-[452px] top-[608px] absolute">
          <input
            className="w-[441px] h-[50px] left-0 top-0 absolute bg-white rounded-md border border-black text-black text-2xl px-3 font-normal font-['Sarabun']"
            type="password"
            placeholder="รหัสผ่าน"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <div className="left-[692px] top-[696px] absolute">
          <SubmitButton text="เข้าสู่ระบบ" onClick={fetchData} />
        </div>
        <button
          onClick={openPopup}
          className="w-auto h-auto left-[411px] top-[794px] absolute text-neutral-500 text-[13px] font-normal font-['Zen Kaku Gothic Antique'] leading-snug"
        >
          เปลี่ยนเส้นทางบันทึกข้อมูล?
        </button>
        <div className="w-auto h-auto left-[454px] top-[658px] absolute text-zinc-500 text-[13px] font-normal font-['Zen Kaku Gothic Antique'] leading-snug">
          ลืมรหัสผ่าน?
        </div>
        <div className="w-auto h-auto left-[80px] bottom-[10px] absolute justify-center items-center inline-flex">
          <div className="text-neutral-400 text-[12.80px] font-normal font-['Zen Kaku Gothic Antique'] leading-snug">
            <Footer />
          </div>
        </div>
        {apiPopup && (
          <Popup onClose={closePopup}>
            <APISetting />
          </Popup>
        )}
      </div>
    );
  else return <Index />;
}
