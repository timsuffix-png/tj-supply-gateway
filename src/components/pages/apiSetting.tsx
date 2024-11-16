import SubmitButton from "../submitButton";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function APISetting() {
  const [apiPath, setApiPath] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setApiPath(await window.electronAPI.getAPIPath());
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-20 border-black border-2 rounded-2xl flex flex-col">
      <label className="flex flex-col w-full">
        <h1 className="text-2xl text-black font-['Sarabun'] mb-2">
          ลิ้งค์ปลายทาง
        </h1>
        <input
          className="w-[600px] h-[50px] bg-white rounded-md border border-black text-black text-2xl px-3 font-normal font-['Sarabun']"
          type="text"
          placeholder="https://"
          value={apiPath}
          onChange={(e) => setApiPath(e.target.value)}
          onClick={(e: any) => {
            e.target.selectionStart = 0;
            e.target.selectionEnd = apiPath.length;
          }}
        />
      </label>
      <div className="mt-10 flex place-content-end">
        <SubmitButton
          text={"บันทึก"}
          onClick={async () => {
            if (apiPath.length < 10)
              return Swal.fire({
                icon: "error",
                title: "ตรวจสอบข้อมูลใหม่อีกครั้ง",
                text: "ข้อมูลไม่ถูกต้อง",
              });
            await window.electronAPI.setAPIPath(apiPath);
            setApiPath(await window.electronAPI.getAPIPath());
            return Swal.fire({
              position: "top-end",
              icon: "success",
              title: "บันทึกข้อมูลเรียบร้อย",
              showConfirmButton: false,
              timer: 1500,
            });
          }}
        />
      </div>
    </div>
  );
}
