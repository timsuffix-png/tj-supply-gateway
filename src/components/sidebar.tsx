"use client";

import { useAuth } from "./auth/authProvider";
import Index from "./pages";
import { Translator } from "./translator";
import { useEffect, useRef } from "react";

export default function SideBar() {
  const currentUrl = localStorage.getItem("currentUrl").split("/");
  const auth = useAuth();
  const logoImageRef = useRef(null);
  const nameRef = useRef(null)

  useEffect(()=>{
    if (logoImageRef.current && nameRef.current){
      const loadImage = async () => {
        const logo = await window.electronAPI.loadImg("logo.png");
        logoImageRef.current.src = logo;
      };
      loadImage();
    }
  }, [auth])

  const signoutAction = async () => {
    auth.handleLogout(localStorage.getItem("ID"));
  };

  var menus: any = {
    qc: Translator.qc,
    seaward: Translator.seaward
  };

  if (!auth.user) return <Index />;
  else return (
    <>
      <div className="w-[350px] h-screen bg-white flex flex-col border-r-black border-r-2">
        <div className="w-full h-40 flex flex-wrap">
          <div className="w-full h-2/3 flex justify-center place-items-center">
            <img
              className="w-[260px] h-[60px]"
              ref={logoImageRef}
              width={260}
              height={60}
              alt="logo"
            />
          </div>
          <div className="w-full h-1/3 flex">
            <h2 className="w-full h-full text-black text-2xl font-normal font-['Sarabun'] flex place-items-center justify-center" ref={nameRef}>
              ผู้ใช้: {auth.user.data?.name} {auth.user.data?.surname}
            </h2>
          </div>
        </div>
        <div className="w-full h-[65px] text-black text-3xl font-bold font-['Sarabun'] text-left flex place-items-center border-t-[2px] border-t-black">
          <span className="ml-[20px]">รายการ</span>
        </div>
        <div className="w-full h-full overflow-y-auto">
          {Object.keys(menus).map((menu) => {
            if (currentUrl.includes(menu)) {
              return (
                <button className="w-full" onClick={()=>{localStorage.setItem("currentUrl", menu);window.location.reload()}} key={menu}>
                  <div className="w-full h-[70px] flex place-items-center bg-gray-200 hover:bg-gray-300">
                    <div className="ml-[20px] mr-[10px] w-[40px] h-[40px]">
                      <div className="flex place-items-center place-content-center h-full scale-[133.33%]">
                        {menus[menu].icon}
                      </div>
                    </div>
                    <div className="w-full h-full">
                      <h3 className="w-full h-full text-black text-2xl font-normal font-['Sarabun'] flex place-items-center justify-start pl-5">
                        {menus[menu].name}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            } else {
              return (
                <button className="w-full" onClick={()=>{localStorage.setItem("currentUrl", menu);window.location.reload()}} key={menu}>
                  <div className="w-full h-[70px] flex place-items-center hover:bg-gray-200">
                    <div className="ml-[20px] mr-[10px] w-[40px] h-[40px]">
                      <div className="flex place-items-center place-content-center h-full scale-[133.33%]">
                        {menus[menu].icon}
                      </div>
                    </div>
                    <div className="w-full h-full">
                      <h3 className="w-full h-full text-black text-2xl font-normal font-['Sarabun'] flex place-items-center justify-start pl-5">
                        {menus[menu].name}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            }
          })}
        </div>
        <div className="flex w-full h-[60px]">
          <button
            onClick={signoutAction}
            className="flex place-self-end w-[114px] h-[60px]"
          >
            <div className="w-full h-[60px]">
              <div className="w-full h-[60px] bg-red-400 hover:bg-red-500 flex place-items-center justify-center">
                <div className="scale-[133.33%] rotate-180">
                  {Translator.logout.icon}
                </div>
              </div>
            </div>
          </button>
          <button
            onClick={() => {
              localStorage.setItem("currentUrl", "setting");
              window.location.reload();
            }}
            className="w-[236px] h-[60px] flex place-self-end"
          >
            <div className="w-full h-[60px]">
              <div className="w-full h-[60px] left-0 top-0 bg-slate-400 hover:bg-slate-500 flex justify-center place-items-center">
                <div className="scale-[133.33%] rotate-180">
                  {Translator.setting.icon}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
