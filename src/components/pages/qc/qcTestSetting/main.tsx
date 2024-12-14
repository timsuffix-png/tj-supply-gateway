"use client";

import SideBar from "../../../sidebar";
import Breadcrumb from "../../../breadcrumb";
import Footer from "../../../footer";
import { useState, useEffect } from "react";
import Pagination from "../../../pagination";
import BackButton from "../../../backButton";
import { Translator } from "../../../translator";
import SubmitButton from "../../../submitButton";
import Swal from "sweetalert2";
import { useAuth } from "../../../auth/authProvider";

export default function QcSetting() {
  localStorage.setItem("currentUrl", "qc/testSetting");
  const auth = useAuth();
  const [qcMain, setQcMain] = useState<{
    error: boolean;
    message: string;
    data: [
      {
        ID: string;
        qcType: {
          name: string;
        };
        testName: string;
        detail: string;
      }
    ];
    allPage: number;
  } | null>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    refreshData();
  }, [auth]);

  const refreshData = async () => {
    const data = await fetchQcMainData(page);
    setQcMain(data);
  };

  const increasePage = () => {
    setPage(page >= qcMain.allPage ? qcMain.allPage : page + 1);
  };
  const decreasePage = () => {
    setPage(page <= 1 ? 1 : page - 1);
  };
  const firstPage = () => {
    setPage(1);
  };
  const lastPage = () => {
    setPage(qcMain.allPage);
  };

  const fetchQcMainData = async (page: number) => {
    const data = await window.electronAPI.fetch({
      method: "GET",
      URL: `qc/main?limit=10&page=${page}`,
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
                    localStorage.setItem("currentUrl", "qc");
                    window.location.reload();
                  }}
                  className="ml-5 sm:ml-20 cursor-pointer"
                >
                  <BackButton text="ย้อนกลับ" />
                </div>
                <h2 className="ml-5 sm:ml-20 text-black text-lg xl:text-xl 2xl:text-2xl font-bold font-['Sarabun'] text-wrap">
                  ตั้งค่าการทดสอบ
                </h2>
              </div>
              <div className="flex w-full place-content-center mt-3 sm:mt-0 sm:w-auto sm:pr-5 lg:pr-20">
                <div
                  tabIndex={0}
                  onClick={() => {
                    localStorage.setItem("currentUrl", "qc/testSetting/create");
                    window.location.reload();
                  }}
                >
                  <SubmitButton text="สร้าง" />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full mt-[30px]">
              <div className="sm:ml-10 sm:mr-20 mt-10 flex flex-col place-content-center border border-[#cecece] rounded-xl">
                <div className="flex place-content-center">
                  <div className="w-[95%] my-[20px]">
                    <div className="text-black font-bold">
                      <div className="bg-[#6494d3] rounded-t-3xl flex flex-row h-10 place-items-center">
                        <div className="w-2/12 text-center text-base lg:text-lg font-bold font-['Sarabun'] text-ellipsis overflow-hidden">
                          ประเภท
                        </div>
                        <div className="w-3/12 text-center text-base lg:text-lg font-bold font-['Sarabun'] text-ellipsis overflow-hidden">
                          ชื่อการทดสอบ
                        </div>
                        <div className="w-5/12 text-center text-base lg:text-lg font-bold font-['Sarabun'] text-ellipsis overflow-hidden">
                          รายละเอียด
                        </div>
                        <div className="w-1/12 text-center text-base lg:text-lg font-bold font-['Sarabun'] text-ellipsis overflow-hidden">
                          แก้ไข
                        </div>
                        <div className="w-1/12 text-center text-base lg:text-lg font-bold font-['Sarabun'] text-ellipsis overflow-hidden">
                          ลบ
                        </div>
                      </div>
                    </div>
                    <div className="text-black">
                      {qcMain?.data?.map((data) => {
                        return (
                          <div
                            key={data.ID}
                            className="flex flex-row w-full h-12 hover:bg-gray-200"
                          >
                            <div className="w-2/12 text-start text-base lg:text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              <div className="hidden sm:block">
                                {Translator.type.icon}
                              </div>
                              <h5 className="sm:ml-1 text-ellipsis overflow-hidden">{data.qcType.name}</h5>
                            </div>
                            <div className="w-3/12 text-center text-base lg:text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              <h5 className="text-ellipsis overflow-hidden">{data.testName}</h5>
                            </div>
                            <div className="w-5/12 text-center text-base lg:text-lg font-['Sarabun'] flex place-content-start place-items-center">
                              <h5 className="text-ellipsis overflow-hidden">{data.detail}</h5>
                            </div>
                            <div className="w-1/12 text-center text-base lg:text-lg font-['Sarabun'] flex place-content-center place-items-center text-ellipsis overflow-hidden">
                              <button
                                onClick={() => {
                                  localStorage.setItem(
                                    "currentUrl",
                                    "qc/testSetting/edit"
                                  );
                                  localStorage.setItem("param", data.ID);
                                  window.location.reload();
                                }}
                              >
                                {Translator.edit.icon}
                              </button>
                            </div>
                            <div className="w-1/12 text-center text-base lg:text-lg font-['Sarabun'] flex place-content-center place-items-center text-ellipsis overflow-hidden">
                              <button
                                onClick={() => {
                                  Swal.fire({
                                    title: `ลบข้อมูล "${data.testName}" จริงหรือไม่`,
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
                                        URL: `qc/main/${data.ID}`,
                                      });
                                      await refreshData();
                                      Swal.fire({
                                        title: "ลบข้อมูลสำเร็จ",
                                        text: `ข้อมูลเกี่ยวกับ "${data.testName}" ถูกลบสำเร็จ`,
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
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex place-content-center">
                <Pagination
                  currentPage={page}
                  allPage={qcMain?.allPage}
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
