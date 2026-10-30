"use client";

import SideBar from "../../../sidebar";
import Breadcrumb from "../../../breadcrumb";
import Footer from "../../../footer";
import { useState, useEffect } from "react";
import BackButton from "../../../backButton";
import SubmitButton from "../../../submitButton";
import Swal from "sweetalert2";
import Select, { MultiValue } from "react-select";
import { useAuth } from "../../../auth/authProvider";

export default function CreateQcProject() {
  localStorage.setItem("currentUrl", "qc/project/create");
  const auth = useAuth();
  const [formulaProjectList, setFormulaProjectList] = useState<{
    error: boolean;
    message: string;
    data: [
      {
        ID: string;
        testName: string;
      }
    ];
    allPage: number;
  } | null>();
  const [qcMain, setQcMain] =
    useState<MultiValue<{ value: string; label: string }>>();
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    fetchData();
  }, [auth]);

  const createQcProject = async () => {
    if (!qcMain?.length)
      return Swal.fire({
        icon: "error",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบตามช่องที่มี * สีแดง",
      });
    const temp = qcMain.map((data) => data.value);
    if (!(!name || !qcMain.length)) {
      const data = await window.electronAPI.fetch({
        method: "POST",
        URL: `qc/itemProject/multi`,
        body: {
          projectName: name,
          detail: detail,
          qcMainID: temp,
        },
      });
      if (!data) {
        return Swal.fire({
          icon: "error",
          title: "ไม่สามารถสร้างโปรเจกต์ได้",
          text: "กรุณาตรวจสอบข้อมูล หรือการเชื่อมต่อกับระบบใหม่อีกครั้ง",
        });
      } else {
        return Swal.fire({
          position: "top-end",
          icon: "success",
          title: "บันทึกข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      }
    } else {
      return Swal.fire({
        icon: "error",
        title: "กรอกข้อมูลไม่ครบ",
        text: "กรุณากรอกข้อมูลให้ครบตามช่องที่มี * สีแดง",
      });
    }
  };

  const fetchData = async () => {
    const formulaData = await fetchFormulaProjectList();
    setFormulaProjectList(formulaData);
  };

  const fetchFormulaProjectList = async () => {
    const data = await window.electronAPI.fetch({
      method: "GET",
      URL: `qc/main?limit=9999999&page=1`,
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
            <div className="flex flex-col sm:flex-row w-full sm:place-content-between sm:place-items-center">
              <div className="flex flex-row w-full place-content-start place-items-center">
                <div
                  tabIndex={0}
                  onClick={() => {
                    localStorage.setItem("currentUrl", "qc/project");
                    window.location.reload();
                  }}
                  className="ml-5 sm:ml-20 cursor-pointer"
                >
                  <BackButton text="ย้อนกลับ" />
                </div>
                <h2 className="ml-5 sm:ml-20 text-black text-lg xl:text-xl 2xl:text-2xl font-bold font-['Sarabun'] text-wrap">
                  สร้างโปรเจ็คการทดสอบ
                </h2>
              </div>
              <div className="w-full flex place-content-center mt-3 sm:mt-0 sm:w-auto sm:pr-5 lg:pr-20">
                <SubmitButton text="สร้าง" onClick={createQcProject} />
              </div>
            </div>
            <div className="bg-white w-full flex flex-col place-items-center place-content-center">
              <div className="w-full sm:w-[90%] mt-5 flex flex-col place-items-center place-content-between border-black border-2 rounded-[15px]">
                <div className="mx-10 my-10 w-[90%] flex flex-col text-black text-xl font-['Sarabun']">
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-[100%]">
                      <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                        ชื่อโปรเจ็คการทดสอบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <input
                        className="h-[40px] md:h-[50px] w-full border border-black mt-1 px-3 text-base lg:text-lg xl:text-2xl font-normal font-['Sarabun'] rounded-md"
                        type="text"
                        maxLength={100}
                        placeholder="ชื่อโปรเจ็คการทดสอบ"
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
                    <label className="w-full">
                      <h4 className="text-base lg:text-lg xl:text-xl font-normal font-['Sarabun']">
                        การทดสอบ
                        <span className="text-red-600">&nbsp;*</span>
                      </h4>
                      <Select
                        name="formulaProject"
                        closeMenuOnSelect={false}
                        isMulti
                        options={formulaProjectList?.data?.map((data) => ({
                          value: data.ID,
                          label: data.testName,
                        }))}
                        onChange={(e) => setQcMain(e)}
                      />
                    </label>
                  </div>
                  <div className="w-full h-auto mb-5 flex text-black">
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
