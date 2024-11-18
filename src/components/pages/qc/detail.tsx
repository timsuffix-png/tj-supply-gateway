"use client";

import SideBar from "../../sidebar";
import Breadcrumb from "../../breadcrumb";
import Footer from "../../footer";
import BackButton from "../../backButton";
import { useState, useEffect } from "react";
import { useAuth } from "../../auth/authProvider";

export default function QcDetail() {
  const auth = useAuth();
  const param = localStorage.getItem("param");
  const [record, setRecord] = useState([]);

  useEffect(() => {
    refreshData();
  }, [auth]);

  const fetchData = async () => {
    const data = await window.electronAPI.fetch({
      method: "POST",
      URL: `qc/record/findBySerialNumber`,
      body: {
        serialNumber: param
      }
    });
    if (!data) throw new Error("Failed to fetch data.");

    return data;
  };

  const refreshData = async () => {
    const data = await fetchData();
    setRecord(data.data);
  };

  return (
    <>
      <div className="flex w-screen h-screen">
        <SideBar />
        <div className="flex flex-col w-full h-full">
          <Breadcrumb />
          <div className="flex flex-col bg-white w-full h-full overflow-y-auto whitespace-nowrap place-items-center pt-5">
            <div className="flex flex-row w-full place-items-center">
              <div className="flex place-items-center">
                <div
                  tabIndex={0}
                  onClick={() => {
                    localStorage.setItem("currentUrl", "qc");
                    window.location.reload();
                  }}
                  className="ml-20 cursor-pointer"
                >
                  <BackButton text="ย้อนกลับ" />
                </div>
                <h2 className="ml-20 text-black text-2xl font-bold font-['Sarabun']">
                  รายละเอียดการทดสอบ
                </h2>
              </div>
            </div>
            <div className="flex flex-col w-7/12 h-auto">
              {record.length ? (
                record.map((data) => {
                  if (data.tag === "qcRecord") {
                    return (
                      <div
                        key={data.ID}
                        className="text-black w-full border border-black mt-5 rounded-2xl pb-5"
                      >
                        <div className="w-full flex px-5 pt-3 pb-2 place-content-between place-items-center bg-[#76a0d6] rounded-t-2xl">
                          <h1 className="text-black font-['Sarabun'] text-xl font-normal">
                            ทดสอบ
                          </h1>
                          <div className="flex">
                            {data.statusOverView === "Passed" ? (
                              <h3 className="text-[#13A452] bg-[#adff9d] w-14 text-lg rounded-xl text-center mr-5">
                                ผ่าน
                              </h3>
                            ) : data.statusOverView === "Failed" ? (
                              <h3 className="text-[#ff0000] bg-[#ffa6a6] w-20 text-lg rounded-xl text-center mr-5">
                                ไม่ผ่าน
                              </h3>
                            ) : data.statusOverView === "In progress" ? (
                              <h3 className="text-[#ff6600] bg-[#ffea8f] w-32 text-lg rounded-xl text-center mr-5">
                                รอการตรวจสอบ
                              </h3>
                            ) : null}
                            <h1 className="text-black text-lg font-normal font-['Sarabun']">
                              {data.updatedAt.split("T")[0] +
                                " " +
                                data.updatedAt.split("T")[1]}
                            </h1>
                          </div>
                        </div>
                        <h1 className="text-black font-normal font-['Sarabun'] text-lg w-full text-center mt-5">
                          ทดสอบโดย
                        </h1>
                        <h1 className="text-black font-normal font-['Sarabun'] text-lg w-full text-center mt-5">
                          ผู้ใช้: {data.testBy.name + " " + data.testBy.surname}
                        </h1>
                      </div>
                    );
                  } else if (data.tag === "repair") {
                    return (
                      <div
                        key={data.ID}
                        className="text-black w-full border border-black mt-5 rounded-2xl pb-5"
                      >
                        <div className="w-full flex px-5 pt-3 pb-2 place-content-between place-items-center bg-[#f3856a] rounded-t-2xl">
                          <h1 className="text-black font-['Sarabun'] text-xl font-normal">
                            ซ่อมแซม
                          </h1>
                          <div className="flex">
                            <h1 className="text-black text-lg font-normal font-['Sarabun']">
                              {data.createdAt.split("T")[0] +
                                " " +
                                data.createdAt.split("T")[1]}
                            </h1>
                          </div>
                        </div>
                        <h1 className="text-black font-normal font-['Sarabun'] text-lg w-full text-center mt-5">
                          ซ่อมแซมโดย
                        </h1>
                        <h1 className="text-black font-normal font-['Sarabun'] text-lg w-full text-center mt-5">
                          ผู้ใช้:{" "}
                          {data.repairBy.name + " " + data.repairBy.surname}
                        </h1>
                      </div>
                    );
                  } else {
                    null;
                  }
                })
              ) : (
                <h1 className="text-black w-full text-lg font-normal font-['Sarabun'] text-center">
                  ไม่มีข้อมูล
                </h1>
              )}
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
