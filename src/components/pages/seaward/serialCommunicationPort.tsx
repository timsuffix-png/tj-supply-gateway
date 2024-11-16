import SubmitButton from "../../submitButton";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

export default function SerialCommunicationPort() {
  const [portList, setPortList] = useState<Electron.SerialPort[]>();
  const [COMPort, setCOMPort] = useState<number | null>();

  useEffect(() => {
    const fetchData = async () => {
      window.electronAPI.portlist(setPortList);
      serialPortList();
      setCOMPort(Number(await window.electronAPI.getCOMPort()));
    };
    fetchData();
  }, []);

  const serialPortList = async () => {
    try {
      await navigator.serial.requestPort();
    } catch {}
  };

  return (
    <div className="bg-white p-20 border-black border-2 rounded-2xl flex flex-col">
      <label className="flex flex-col w-full">
        <h1 className="text-2xl text-black font-['Sarabun'] mb-2">
          พอร์ตในเครื่องทั้งหมด
        </h1>
        <div className="w-[600px] bg-white rounded-md border border-black text-black text-xl font-normal font-['Sarabun']">
          <Select
            name="formulaProject"
            closeMenuOnSelect={true}
            options={portList?.map((data) => ({
              value: data.portName,
              label: data.portName + " " + data.displayName,
            }))}
            defaultMenuIsOpen
            onChange={(e) => setCOMPort(Number(e.value.replace("COM", "")))}
          />
        </div>
      </label>
      <div className="mt-10 flex place-content-end">
        <SubmitButton
          text={"บันทึก"}
          onClick={async () => {
            if (!COMPort)
              return Swal.fire({
                icon: "error",
                title: "ตรวจสอบข้อมูลใหม่อีกครั้ง",
                text: "กรุณาเลือกพอร์ตก่อนบันทึก",
              });
            await window.electronAPI.setCOMPort(COMPort);
            setCOMPort(await window.electronAPI.getAPIPath());
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
