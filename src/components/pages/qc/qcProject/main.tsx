"use client";

import { useState, useEffect } from "react";
import SideBar from "../../../sidebar";
import Breadcrumb from "../../../breadcrumb";
import Footer from "../../../footer";
import SubmitButton from "../../../submitButton";
import { Translator } from "../../../translator";
import BackButton from "../../../backButton";
import Swal from "sweetalert2";
import Pagination from "../../../pagination";
import { useAuth } from "../../../auth/authProvider";

export default function QcProject() {
  localStorage.setItem("currentUrl", "qc/project")
  const auth = useAuth()
  const [page, setPage] = useState(1);
  const [qcProject, setQcProject] = useState<{
    error: boolean;
    message: string;
    data: [
      {
        ID: string,
        projectName: string,
        qcItemProject: [
          {
            ID: string,
            qcMain: {
              testName: string,
              detail: string
            }
          }
        ]
      }
    ];
    allPage: number;
  } | null>();

  useEffect(()=>{
    refreshData()
  }, [auth, page])

  const fetchData = async () => {
    const data = await window.electronAPI.fetch({
      method: "GET",
      URL: `qc/project/extend?limit=10&page=${page}`,
    });
    if (!data) {
      throw new Error("Failed to fetch data");
    }
    return data
  };

  const refreshData = async () => {
    const data = await fetchData();
    setQcProject(data);
  };

  const increasePage = () => {
    setPage(
      page >= qcProject.allPage
        ? qcProject.allPage
        : page + 1
    );
  };
  const decreasePage = () => {
    setPage(page <= 1 ? 1 : page - 1);
  };
  const firstPage = () => {
    setPage(1);
  };
  const lastPage = () => {
    setPage(qcProject.allPage);
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <div>
          <SideBar />
        </div>
        <div className="flex flex-col w-full h-full">
          <Breadcrumb />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-5">
            <div className="flex flex-col sm:flex-row w-full sm:place-content-between sm:place-items-center">
              <div className="flex flex-row w-full place-content-start place-items-center">
                <div tabIndex={0} onClick={()=>{localStorage.setItem("currentUrl", "qc");window.location.reload()}} className="ml-5 sm:ml-20 cursor-pointer">
                  <BackButton text="ย้อนกลับ" />
                </div>
                <h2 className="ml-5 sm:ml-20 text-black text-lg xl:text-xl 2xl:text-2xl font-bold font-['Sarabun'] text-wrap">
                  โปรเจ็คการทดสอบ
                </h2>
              </div>
              <div className="flex w-full place-content-center mt-3 sm:mt-0 sm:w-auto sm:pr-5 lg:pr-20">
                <div tabIndex={0} onClick={()=>{localStorage.setItem("currentUrl", "qc/project/create");window.location.reload()}} className="ml-20 cursor-pointer">
                  <SubmitButton text="สร้าง" />
                </div>
              </div>
            </div>
            <div className="w-full h-auto mt-[20px]">
              {qcProject?.data?.map((project) => {
                return (
                  <div
                    key={project.ID}
                    className="sm:ml-10 sm:mr-20 mt-10 pb-10 flex flex-col place-content-center place-items-center border border-[#cecece] rounded-xl shadow-lg"
                  >
                    <div className="w-full flex place-content-between px-5 mt-2">
                      <div className="flex place-items-end">
                        <h3 className="text-black text-lg lg:text-xl font-bold font-['Sarabun']">
                          {project.projectName}
                        </h3>
                      </div>
                      <div className="flex place-items-center">
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: `ลบข้อมูล "${project.projectName}" จริงหรือไม่`,
                              text: "หลังจากลบไปแล้วข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบไปด้วย",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "ตกลง",
                              cancelButtonText: "ยกเลิก",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                await window.electronAPI.fetch({
                                  method: "DELETE",
                                  URL: `qc/project/${project.ID}`,
                                });
                                await refreshData();
                                Swal.fire({
                                  title: "ลบข้อมูลสำเร็จ",
                                  text: `ข้อมูลเกี่ยวกับ "${project.projectName}" ถูกลบสำเร็จ`,
                                  icon: "success",
                                });
                              }
                            });
                          }}
                        >
                          {Translator.delete.icon}
                        </button>
                      </div>
                    </div>
                    <h4 className="text-gray-500 w-full text-base font-normal font-['Sarabun'] pl-16 mt-5">
                      รายละเอียด
                    </h4>
                    <div className="w-[92%] h-auto my-[20px] flex flex-col place-content-start">
                      <div>
                        <h3 className="text-black font-bold mt-10">
                          {/* {itemProject.name} */}
                        </h3>
                        <div className="mt-5">
                          <div className="text-black font-bold">
                            <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                              <div className="w-4/12 text-center text-base lg:text-lg font-bold font-['Sarabun'] text-ellipsis overflow-hidden">
                                ชื่อการทดสอบ
                              </div>
                              <div className="w-8/12 text-center text-base lg:text-lg font-bold font-['Sarabun'] text-ellipsis overflow-hidden">
                                รายละเอียด
                              </div>
                            </div>
                          </div>
                          {project.qcItemProject.map((itemProject) => {
                            return (
                              <div key={itemProject.ID} className="text-black">
                                <div className="flex flex-row w-full h-12 hover:bg-gray-200">
                                  <div className="w-4/12 text-start text-base lg:text-lg font-['Sarabun'] flex place-items-center place-content-start">
                                    <div className="hidden sm:block">
                                      {Translator.qc.icon}
                                    </div>
                                    <h5 className="sm:ml-1 text-ellipsis overflow-hidden">
                                      {itemProject.qcMain.testName}
                                    </h5>
                                  </div>
                                  <div className="w-8/12 text-start text-base lg:text-lg font-['Sarabun'] flex place-items-center place-content-start">
                                    <div className="hidden sm:block">
                                      {Translator.detail.icon}
                                    </div>
                                    <h5 className="sm:ml-1 text-ellipsis overflow-hidden">
                                      {itemProject.qcMain.detail}
                                    </h5>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex place-content-center">
                <Pagination
                  currentPage={page}
                  allPage={qcProject?.allPage}
                  increase={increasePage}
                  decrease={decreasePage}
                  first={firstPage}
                  last={lastPage}
                />
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
