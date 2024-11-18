"use client";

import SideBar from "../../sidebar";
import Breadcrumb from "../../breadcrumb";
import Footer from "../../footer";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/authProvider";
import Select from "react-select";
import Popup from "../popup";
import SerialCommunicationPort from "./serialCommunicationPort";
import { Translator } from "../../translator";
import SubmitButton from "../../submitButton";
import Swal from "sweetalert2";
import Testing from "./testing";
import TestHistory from "./testHistory";

export default function Seaward() {
  const auth = useAuth();
  const [currentCOMPort, setCurrentCOMPort] = useState<number | null>();
  const [qcProjects, setQcProjects] = useState<{
    error: boolean;
    message: string;
    data: [
      {
        ID: string;
        projectName: string;
        detail: string;
      }
    ];
    allPage: number;
  } | null>();
  const [qcProject, setQcProject] = useState("");
  const [qcMains, setQcMains] = useState<{
    error: boolean;
    message: string;
    data: [
      {
        ID: string;
        qcMain:
          | {
              qcType: {
                ID: string;
                name: string;
              };
              ID: string;
              testName: string;
              detail: string;
              qcScript: {
                ID: string;
                script: {
                  script_1: string;
                  script_2: number;
                  script_3: number;
                  script_4: string;
                  script_5: number;
                  script_6: number;
                  script_7: number;
                  script_8: number;
                  script_9: number;
                  script_10: number;
                  script_11: number;
                  script_12: number;
                  script_13: number | undefined;
                  script_14: number | undefined;
                  script_15: number | undefined;
                  script_16: number | undefined;
                };
              };
              status: string;
              result: string;
              allResult: string;
            }
          | undefined;
        qcProject: {
          ID: string;
          projectName: string;
          detail: string;
        };
      }
    ];
  } | null>();
  const [serialNumber, setSerialNumber] = useState("");
  const [popup, setPopup] = useState(false);
  const openPopup = () => setPopup(true);
  const closePopup = async () => {
    setPopup(false);
    setCurrentCOMPort(Number(await window.electronAPI.getCOMPort()));
  };
  const [testing, setTesting] = useState(false);
  const revealValue = useRef([]);
  let elementKey1 = 0;
  let elementKey2 = 0;
  const [isSelectedCard, setIsSelectedCard] = useState(false);

  useEffect(() => {
    fetchData();
  }, [auth, qcProject]);

  useEffect(() => {
    setQcProject(null);
  }, [isSelectedCard]);

  const fetchData = async () => {
    const qcProjectData = await window.electronAPI.fetch({
      method: "GET",
      URL: `qc/project?limit=999999999999&page=1`,
    });
    if (qcProject?.length > 0 && !isSelectedCard) {
      const qcMainDatas = await window.electronAPI.fetch({
        method: "GET",
        URL: `qc/itemProject/${qcProject}`,
      });
      setQcMains(qcMainDatas);
    }
    setQcProjects(qcProjectData);
    setCurrentCOMPort(Number(await window.electronAPI.getCOMPort()));
  };

  const seawardTest = async () => {
    if (!currentCOMPort)
      return Swal.fire({
        icon: "error",
        title: "กรุณาเลือกพอร์ตที่ใช้ต่อเครื่อง Seaward",
      });
    if (!qcMains)
      return Swal.fire({
        icon: "error",
        title: "กรุณาเลือกโปรเจ็คการทดสอบ",
      });
    if (!serialNumber)
      return Swal.fire({
        icon: "error",
        title: "กรุณาแสกน Qr-Code สินค้าก่อนการทดสอบ",
      });
    // clear before result
    let newQcMains = { ...qcMains };
    for (let i in newQcMains.data) {
      newQcMains.data[i].qcMain.status = null;
      newQcMains.data[i].qcMain.result = null;
      newQcMains.data[i].qcMain.allResult = null;
    }
    setQcMains(newQcMains);
    let record: any;
    if (!isSelectedCard) {
      record = await window.electronAPI.fetch({
        method: "POST",
        URL: "qc/record",
        body: {
          qcProjectID: qcProject,
          serialNumber: serialNumber,
          testBy: auth.user.data.ID,
        },
      });
    } else {
      record = qcMains;
    }

    setTesting(true);
    for (let i in qcMains.data) {
      let script = "SSSCMD_HAL_PERFORM_TEST(";
      if (qcMains.data[i].qcMain.qcType.name.toLowerCase() != "seaward")
        continue;
      for (let value of Object.values(qcMains.data[i].qcMain.qcScript.script)) {
        script += value + ", ";
      }
      script = script.substring(0, script.length - 2) + ")\n";
      const result = await window.electronAPI.fakeSssTest({
        script: script,
        COM: currentCOMPort,
      });
      while (!result) {}
      let resultArray = result.split("\n");
      let splitResultArray = resultArray[resultArray.length - 4].split(",");

      let newQcMains = { ...qcMains };
      newQcMains.data[i].qcMain.status = splitResultArray[0].includes("Passed")
        ? "Passed"
        : "Failed";
      newQcMains.data[i].qcMain.result = splitResultArray
        .slice(1, splitResultArray.length)
        .join(",");
      newQcMains.data[i].qcMain.allResult = result;
      setQcMains(newQcMains);

      await window.electronAPI.fetch({
        method: "POST",
        URL: "qc/status",
        body: {
          qcRecordID: record.data[0].ID,
          qcMainID: qcMains.data[i].qcMain.ID,
          status: newQcMains.data[i].qcMain.status,
          detail:
            newQcMains.data[i].qcMain.status === "Passed"
              ? ""
              : splitResultArray[0].split(":")[3].trim(),
        },
      });
    }
    setSerialNumber(null);
    setTesting(false);
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-5">
            <div className="flex w-full">
              <div className="w-1/12 ml-10">
                <div className="w-full">
                  <h4 className="text-xl font-normal font-['Sarabun']">
                    Seaward port
                    <span className="text-red-600">&nbsp;*</span>
                  </h4>
                  <div className="text-black text-xl flex place-content-between w-full mt-2">
                    {currentCOMPort ? <h1>{"COM" + currentCOMPort}</h1> : null}
                    <button onClick={openPopup}>
                      {currentCOMPort ? "เปลี่ยน?" : "เลือก?"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-2/12 ml-10">
                <label className="w-full">
                  <h4 className="text-xl font-normal font-['Sarabun']">
                    โปรเจ็คการทดสอบ
                    <span className="text-red-600">&nbsp;*</span>
                  </h4>
                  {!isSelectedCard ? (
                    <Select
                      className="rounded-md border border-black text-black text-xl font-normal font-['Sarabun']"
                      name="formulaProject"
                      closeMenuOnSelect={true}
                      options={qcProjects?.data?.map((data) => ({
                        value: data.ID,
                        label: data.projectName,
                      }))}
                      onChange={(e) => setQcProject(e.value)}
                    />
                  ) : (
                    <h1 className="text-red-600 text-xl h-10 flex place-items-end">
                      มีการทดสอบที่ถูกเลือกแล้ว
                    </h1>
                  )}
                </label>
              </div>
              <div className="w-9/12 mx-10">
                <label className="w-full">
                  <h4 className="text-xl font-normal font-['Sarabun']">
                    รหัสสินค้า
                    <span className="text-red-600">&nbsp;*</span>
                  </h4>
                  <input
                    className="h-[40px] w-full border border-black mt-1 px-3 text-xl font-normal font-['Sarabun'] rounded-md"
                    type="text"
                    placeholder="รหัสสินค้า"
                    onClick={(e: any) => {
                      e.target.value = "";
                      setSerialNumber("");
                    }}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    required
                  />
                </label>
              </div>
            </div>
            {serialNumber && (
              <TestHistory
                serialNumber={serialNumber}
                setData={setQcMains}
                isChecked={setIsSelectedCard}
              />
            )}
            <div className="flex flex-col w-full mt-10">
              <div className="flex flex-row w-full place-items-center">
                <h2 className="ml-40 text-black text-xl font-normal font-['Sarabun']">
                  รายการการทดสอบ
                </h2>
              </div>
              <div className="ml-10 mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          ชื่อการทดสอบ
                        </div>
                        <div className="w-3/12 text-center text-lg font-bold font-['Sarabun']">
                          สถานะ
                        </div>
                        <div className="w-5/12 text-center text-lg font-bold font-['Sarabun']">
                          ผลลัพธ์
                        </div>
                        <div className="w-1/12 text-center text-lg font-bold font-['Sarabun']">
                          ข้อมูล
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {qcMains?.data?.map((data, index) => {
                        if (data.qcMain.qcType.name.toLowerCase() == "seaward")
                          return (
                            <div key={elementKey1++}>
                              <div className="flex flex-row w-full h-12 hover:bg-gray-200">
                                <div className="w-3/12 text-start text-lg font-['Sarabun'] flex place-items-center">
                                  {Translator.qc.icon}
                                  <h5 className="ml-1">
                                    {data.qcMain.testName}
                                  </h5>
                                </div>
                                <div className="w-3/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                                  {data.qcMain.status === "Passed" ? (
                                    <h3 className="text-[#13A452] bg-[#adff9d] px-2 text-sm rounded-xl">
                                      ผ่าน
                                    </h3>
                                  ) : data.qcMain.status === "Failed" ? (
                                    <h3 className="text-[#ff0000] bg-[#ffa6a6] px-2 text-sm rounded-xl">
                                      ไม่ผ่าน
                                    </h3>
                                  ) : null}
                                </div>
                                <div className="w-5/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                                  {data.qcMain.result}
                                </div>
                                <div className="w-1/12 text-center text-lg font-['Sarabun'] flex place-content-center place-items-center">
                                  <button
                                    onClick={() => {
                                      if (revealValue.current[index]) {
                                        if (
                                          revealValue.current[
                                            index
                                          ].className.includes("hidden")
                                        ) {
                                          revealValue.current[index].className =
                                            revealValue.current[
                                              index
                                            ].className.replaceAll(
                                              "hidden",
                                              "flex"
                                            );
                                        } else {
                                          revealValue.current[index].className =
                                            revealValue.current[
                                              index
                                            ].className.replaceAll(
                                              "flex",
                                              "hidden"
                                            );
                                        }
                                      }
                                    }}
                                  >
                                    {data.qcMain.allResult &&
                                      Translator.info.icon}
                                  </button>
                                </div>
                              </div>
                              <div
                                className="hidden flex-col w-full h-96 bg-gray-100 overflow-y-auto"
                                ref={(el) => (revealValue.current[index] = el)}
                              >
                                {data.qcMain.allResult &&
                                  data.qcMain.allResult
                                    .split("\n")
                                    .map((data: string) => {
                                      return (
                                        <h1
                                          key={elementKey2++}
                                          className="text-black text-base"
                                        >
                                          {data}
                                        </h1>
                                      );
                                    })}
                              </div>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex place-content-end place-items-center w-full pr-20 pt-20">
                <div>
                  {(qcProject || isSelectedCard) && serialNumber && (
                    <SubmitButton
                      text="ทดสอบ"
                      className="bg-red-600"
                      onClick={seawardTest}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse place-content-center">
              <Footer />
            </div>
          </div>
        </div>
      </div>
      {popup && (
        <Popup onClose={closePopup}>
          <SerialCommunicationPort />
        </Popup>
      )}
      {testing && <Testing />}
    </>
  );
}
