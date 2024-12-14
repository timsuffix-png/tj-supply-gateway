"use client";

import SideBar from "../../../sidebar";
import Breadcrumb from "../../../breadcrumb";
import Footer from "../../../footer";
import { useState, useEffect } from "react";
import BackButton from "../../../backButton";
import SubmitButton from "../../../submitButton";
import Swal from "sweetalert2";
import { useAuth } from "../../../auth/authProvider";

export default function AddTestSetting() {
  const auth = useAuth();

  const [qcType, setQcType] = useState({ name: "", value: "" });
  const [qcTypeList, setQcTypeList] = useState<{
    error: boolean;
    message: string;
    data: [
      {
        ID: string;
        name: string;
      }
    ];
    allPage: number;
  } | null>();
  const [qcClass, setQcClass] = useState("");
  const [qcScript, setQcScript] = useState({
    script_1: "SSSID_HAL_TEST_TYPE_",
    script_2: 0,
    script_3: 0,
    script_4: "SSSVAL_HAL_TSTART_NONE",
    script_5: 0,
    script_6: 0,
    script_7: 0,
    script_8: 0,
    script_9: 0,
    script_10: 0,
    script_11: 0,
    script_12: 0,
    script_13: 0,
    script_14: 0,
    script_15: 0,
    script_16: 0,
  });
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    fetchData();
  }, [auth]);

  const createNewTest = async () => {
    const temp = { ...qcScript };
    temp.script_1 = temp.script_1 + qcClass;
    if (!name || !qcType.value || (qcType.name === "seaward" && !qcClass)) {
      Swal.fire({
        icon: "error",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบตามช่องที่มี * สีแดง",
      });
      return;
    }

    if (qcType.name === "seaward") {
      if (qcClass === "PWRLK") {
        var data = await window.electronAPI.fetch({
          method: "POST",
          URL: "qc/main",
          body: {
            qcType: qcType.value,
            testName: name,
            detail: detail,
            script: temp,
          },
        });
      } else {
        delete temp.script_13;
        delete temp.script_14;
        delete temp.script_15;
        delete temp.script_16;
        var data = await window.electronAPI.fetch({
          method: "POST",
          URL: "qc/main",
          body: {
            qcType: qcType.value,
            testName: name,
            detail: detail,
            script: temp,
          },
        });
      }
      if (!data) {
        Swal.fire({
          icon: "error",
          title: "ตรวจสอบข้อมูลใหม่อีกครั้ง",
          text: "ชื่อการทดสอบไม่สามารถซ้ำกับของที่มีอยู่ได้ และข้อมูลที่จำเป็นต้องกรอกกรอกครบเรียบร้อยแล้ว",
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => window.location.reload());
      }
    } else {
      // qc type other than seaward
      var data = await window.electronAPI.fetch({
        method: "POST",
        URL: "qc/main",
        body: {
          qcType: qcType.value,
          testName: name,
          detail: detail,
        },
      });
      if (!data) {
        Swal.fire({
          icon: "error",
          title: "ตรวจสอบข้อมูลใหม่อีกครั้ง",
          text: "ชื่อการทดสอบไม่สามารถซ้ำกับของที่มีอยู่ได้ และข้อมูลที่จำเป็นต้องกรอกกรอกครบเรียบร้อยแล้ว",
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => window.location.reload());
      }
    }
  };

  const fetchData = async () => {
    const qcTypeData = await fetchQcTypeList();
    setQcTypeList(qcTypeData);
  };

  const fetchQcTypeList = async () => {
    var data = await window.electronAPI.fetch({
      method: "GET",
      URL: `qc/type?limit=9999999&page=1`,
    });
    if (!data) {
      throw new Error("Failed to fetch data");
    }
    return data;
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <div>
          <SideBar />
        </div>
        <div className="flex flex-col w-full h-full">
          <Breadcrumb />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-[20px]">
            <div className="flex flex-row w-full place-items-center">
              <div className="flex place-items-center">
                <div
                  tabIndex={0}
                  onClick={() => {
                    localStorage.setItem("currentUrl", "qc/testSetting");
                    window.location.reload();
                  }}
                  className="ml-5 sm:ml-20 cursor-pointer"
                >
                  <BackButton text="ย้อนกลับ" />
                </div>
                <h2 className="ml-5 sm:ml-20 text-black text-lg xl:text-xl 2xl:text-2xl font-bold font-['Sarabun'] text-wrap sm:text-nowrap">
                  สร้างการทดสอบ
                </h2>
              </div>
              <div className="hidden md:flex w-full place-content-end mr-20">
                <SubmitButton text="สร้าง" onClick={createNewTest} />
              </div>
            </div>
            <div className="bg-white w-full flex flex-col place-items-center place-content-center">
              <div className="w-full sm:w-[90%] mt-5 flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full flex">
                    <div className="w-3/4 h-full flex">
                      <label className="w-[100%]">
                        <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                          ประเภทการทดสอบ
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <select
                          className="h-[40px] md:h-[50px] w-full pl-5 border border-black mt-1 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                          defaultValue={"none"}
                          onChange={(e) => {
                            setQcType({
                              value: e.target.value,
                              name: e.target.options[e.target.selectedIndex]
                                .text,
                            });
                            if (
                              e.target.options[e.target.selectedIndex].text !==
                              "seaward"
                            )
                              setQcClass(null);
                            setQcScript({
                              script_1: "SSSID_HAL_TEST_TYPE_",
                              script_2: 0,
                              script_3: 0,
                              script_4: "SSSVAL_HAL_TSTART_NONE",
                              script_5: 0,
                              script_6: 0,
                              script_7: 0,
                              script_8: 0,
                              script_9: 0,
                              script_10: 0,
                              script_11: 0,
                              script_12: 0,
                              script_13: 0,
                              script_14: 0,
                              script_15: 0,
                              script_16: 0,
                            });
                          }}
                        >
                          <option
                            value="none"
                            disabled
                            hidden
                            className="text-red-600"
                          >
                            เลือกประเภทการทดสอบ
                          </option>
                          {qcTypeList?.data?.map((data) => {
                            return (
                              <option
                                key={data.ID}
                                value={data.ID}
                                data-something={data.name}
                              >
                                {data.name}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    </div>
                    <div className="w-1/4 h-full flex place-content-center place-items-end">
                      <div
                        tabIndex={0}
                        onClick={() => {
                          localStorage.setItem("currentUrl", "qc/testSetting/create/qcType");
                          window.location.reload();
                        }}
                        className="cursor-pointer"
                      >
                        <h4 className="text-black text-xs sm:text-sm text-wrap">
                          จัดการประเภทการทดสอบ?
                        </h4>
                      </div>
                    </div>
                  </div>
                  {qcType.name === "seaward" && (
                    <div className="w-full h-auto my-2 flex text-black">
                      <label className="w-[100%]">
                        <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                          ชนิดการทดสอบ
                          <span className="text-red-600">&nbsp;*</span>
                        </h4>
                        <select
                          className="h-[40px] md:h-[50px] w-full pl-5 border border-black mt-1 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                          defaultValue={"none"}
                          onChange={(e) => setQcClass(e.target.value)}
                        >
                          <option value="none" disabled hidden>
                            เลือกชนิดการทดสอบ
                          </option>
                          <option value="DCIR">DCIR</option>
                          <option value="HIPOT_50">HIPOT_50</option>
                          <option value="EBOND_50">EBOND_50</option>
                          <option value="PWRLK">POWER_LEAKAGE</option>
                          <option value="PWRTLK">POWER + TOUCH LEAKAGE</option>
                          <option value="HIPOT_60">HIPOT_60</option>
                          <option value="EBOND_60">EBOND_60</option>
                          <option value="HIPOT_DC">HIPOT_DC</option>
                        </select>
                      </label>
                    </div>
                  )}
                  <div className="w-full h-auto my-2 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                        ชื่อการทดสอบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <input
                        className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                        type="text"
                        maxLength={100}
                        placeholder="ชื่อการทดสอบ"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto my-2 flex text-black">
                    <div className="w-full h-full">
                      <label className="w-auto h-auto">
                        <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                          รายละเอียด
                        </h4>
                        <textarea
                          className="bg-white border border-black w-full h-[150px] min-h-[50px] max-h-[150px] rounded-lg text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] px-2 py-2"
                          maxLength={200}
                          onChange={(e) => setDetail(e.target.value)}
                        ></textarea>
                      </label>
                    </div>
                  </div>
                  {qcClass && (
                    <div className="w-full h-auto rounded-[15px] border border-black flex flex-col mb-5">
                      <div className="flex flex-wrap place-content-between">
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            Output
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="Output"
                            value={qcScript.script_5}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_5: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            RampUp
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="RampUp"
                            value={qcScript.script_6}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_6: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            Dwell
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="Dwell"
                            value={qcScript.script_7}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_7: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            TimeToZero
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="TimeToZero"
                            value={qcScript.script_8}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_8: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            LowLimit
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="LowLimit"
                            value={qcScript.script_9}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_9: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            HighLimit
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="HighLimit"
                            value={qcScript.script_10}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_10: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            ArcDetect
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="ArcDetect"
                            value={qcScript.script_11}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_11: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                          <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                            Channel
                            <span className="text-red-600">&nbsp;*</span>
                          </h4>
                          <input
                            className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                            type="number"
                            maxLength={50}
                            placeholder="Channel"
                            value={qcScript.script_12}
                            onChange={(e) =>
                              setQcScript({
                                ...qcScript,
                                script_12: Number(e.target.value),
                              })
                            }
                            required
                          />
                        </label>
                        {qcClass === "PWRLK" && (
                          <>
                            <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                              <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                                LeakageLowLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="LeakageLowLimit"
                                value={qcScript.script_13}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_13: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                            <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                              <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                                PowerHighLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="PowerHighLimit"
                                value={qcScript.script_14}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_14: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                            <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                              <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                                PowerLowLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="PowerLowLimit"
                                value={qcScript.script_15}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_15: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                            <label className="w-full md:w-[45%] h-auto mx-5 md:mx-3 lg:mx-5 my-3 flex flex-col">
                              <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                                LeakageHighLimit
                                <span className="text-red-600">&nbsp;*</span>
                              </h4>
                              <input
                                className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                                type="number"
                                maxLength={50}
                                placeholder="LeakageHighLimit"
                                value={qcScript.script_16}
                                onChange={(e) =>
                                  setQcScript({
                                    ...qcScript,
                                    script_16: Number(e.target.value),
                                  })
                                }
                                required
                              />
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex md:hidden w-full place-content-end mr-20 mt-5">
                    <SubmitButton text="สร้าง" onClick={createNewTest} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse place-content-center">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
