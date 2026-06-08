import { useState, useEffect, useRef } from "react";
import moment from "moment";

export default function TestHistory({
  serialNumber,
  isChecked,
  setData,
}: {
  serialNumber: string;
  isChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
}) {
  let elementKey1 = 0;
  let elementKey2 = 0;
  const [testHistory, setTestHistory] = useState<
    | [
        {
          ID: string;
          createdAt: string;
          updatedAt: string | null;
          statusOverView: string | null;
          qcProject: {
            ID: string;
            projectName: string;
          };
          testBy: {
            ID: string;
            name: string;
            surname: string;
          } | null;
          repairBy: {
            ID: string;
            name: string;
            surname: string;
          } | null;
          tag: string;
        }
      ]
    | null
  >();
  const [remainingTest, setRemainingTest] = useState<
    | {
        ID: string;
        testName: string;
        qcType: {
          ID: string;
          name: string;
        };
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
      }[][]
    | null
  >();
  const [selectedCard, setSelectedCard] = useState<number>();
  const cardRef = useRef([]);

  useEffect(() => {
    setTestHistory(null);
    setRemainingTest(null);
    const fetchHistoryTestData = async () => {
      const result = await window.electronAPI.fetch({
        method: "POST",
        URL: `qc/record/findBySerialNumber`,
        body: {
          serialNumber: serialNumber,
        },
      });

      let buffer = [];
      if (result) {
        setTestHistory(
          result.data.filter(
            (value: any) => value.statusOverView === "In progress"
          )
        );
        for (let data of result.data) {
          if (data.statusOverView === "In progress") buffer.push(data.ID);
        }
        fetchRemainTest(buffer);
      }
    };
    fetchHistoryTestData();
  }, [serialNumber]);

  const fetchRemainTest = async (qcRecordID: string[]) => {
    let buffer = [];
    for (let id of qcRecordID) {
      const result = await window.electronAPI.fetch({
        method: "GET",
        URL: `qc/record/remainingQc/${id}`,
      });
      buffer.push(result.data);
    }
    setRemainingTest(buffer);
  };

  const selectCard = (index: number) => {
    for (let refIndex in cardRef.current) {
      cardRef.current[refIndex].childNodes[2].className = cardRef.current[
        refIndex
      ].childNodes[2].className.replaceAll("flex", "hidden");
    }
    if (selectedCard === index) {
      isChecked(false);
      setSelectedCard(null);
      cardRef.current[index].childNodes[2].className = cardRef.current[
        index
      ].childNodes[2].className.replaceAll("flex", "hidden");
      setData(null);
    } else {
      isChecked(true);
      setSelectedCard(index);
      cardRef.current[index].childNodes[2].className = cardRef.current[
        index
      ].childNodes[2].className.replaceAll("hidden", "flex");

      let buffer: any = [];
      for (let test of remainingTest[index]) {
        buffer.push({
          ID: testHistory[index].ID,
          qcMain: {
            ID: test.ID,
            qcType: test.qcType,
            testName: test.testName,
            detail: "",
            qcScript: test.qcScript,
            status: null,
            result: null,
            allResult: null,
          },
          qcProject: testHistory[index].qcProject,
        });
      }
      setData(null);
      setData({
        error: false,
        message: "",
        data: buffer,
      });
    }
  };

  return (
    <div className="flex w-[500px] sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1280px] 2xl:w-[1186px]">
      {testHistory && (
        <div className="flex w-full">
          <div className="flex flex-row w-full whitespace-nowrap place-items-center place-content-start overflow-x-auto flex-nowrap">
            {testHistory.map((data, index) => {
              if (
                data.tag === "qcRecord" &&
                remainingTest &&
                remainingTest[index] &&
                remainingTest[index].filter(
                  (v) => v.qcType.name.toLowerCase() == "seaward"
                ).length > 0
              ) {
                return (
                  <button
                    key={elementKey1++}
                    className="w-[200px] h-[220px] my-10 ml-5 pt-5 border border-black rounded-xl shadow-lg group hover:scale-110 transition duration-300 relative"
                    ref={(el) => (cardRef.current[index] = el)}
                    id={data.ID}
                    onClick={() => selectCard(index)}
                  >
                    <div className="w-full h-[80%] overflow-y-auto">
                      <h1 className="text-xl font-bold font-['Sarabun']">
                        {data.qcProject.projectName}
                      </h1>
                      <div className="mt-2">
                        {remainingTest &&
                          remainingTest[index].map((test) => {
                            if (test.qcType.name.toLowerCase() == "seaward")
                              return (
                                <li
                                  key={elementKey2++}
                                  id={test.ID}
                                  className="text-start px-5 overflow-hidden text-ellipsis"
                                >
                                  {test.testName}
                                </li>
                              );
                          })}
                      </div>
                    </div>
                    <div className="w-full h-[20%] pl-3 text-start">
                      <h1 className="text-sm">
                        {data.testBy
                          ? data.testBy.name + " " + data.testBy.surname
                          : "-"}
                      </h1>
                      <h1 className="text-xs">
                        {moment().diff(data.updatedAt, "minutes") < 60
                          ? moment().diff(data.updatedAt, "minutes") +
                            " นาทีที่แล้ว"
                          : moment().diff(data.updatedAt, "hours") < 24
                          ? moment().diff(data.updatedAt, "hours") +
                            " ชั่วโมงที่แล้ว"
                          : moment().diff(data.updatedAt, "days") +
                            " วันที่แล้ว"}
                      </h1>
                    </div>
                    <div className="absolute left-0 top-0 rounded-xl hidden">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.8613 2.87109L29.6338 4.62891L10.0049 24.2725L0.366211 14.6338L2.13867 12.8613L10.0049 20.7275L27.8613 2.87109Z"
                          stroke="#00CC00"
                          strokeWidth="4"
                          fill="#00CC00"
                        />
                      </svg>
                    </div>
                  </button>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
