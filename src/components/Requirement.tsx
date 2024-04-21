import { useEffect, useState } from "preact/hooks";

import type { Group } from "../types/Group";
import type { KdbCourse, KdbData } from "../types/KdbCourse";
import type { Major } from "../types/Major";
import type { SelectRequirement } from "../types/SelectRequirement";

import { getAcademicYear, searchCourseFromKdb } from "../features/utils";

import requirements from "../data/major.json";
import styles from "../styles/GraduationChecker.module.css";

interface RequirementProps {
  readonly major: Major;
}

interface CompulsoryProps {
  readonly requirement: any;
}

interface SelectProps {
  readonly requirement: any;
  readonly kdbData: KdbCourse[];
}

interface SelectElementProps {
  readonly select: SelectRequirement;
  readonly kdbData: KdbCourse[];
  readonly compulsoryList: string[];
}

interface SelectGroupProps {
  readonly groupName: string;
  readonly minimum: number;
  readonly maximum: number;
  readonly selects: SelectRequirement[];
  readonly kdbData: KdbCourse[];
  readonly requirements: any;
}

const getKdBData = async () => {
  const dataUrl =
    "https://raw.githubusercontent.com/Mimori256/kdb-parse/main/kdb_gradcheck.json";
  const response = await fetch(dataUrl);
  const data: KdbData = await response.json();
  return data.courses;
};

const isDetailAvailableSelect = (select: SelectRequirement): boolean => {
  const firstCode = select.codes[0];
  return !(firstCode.startsWith("*") || select.isExcludeRequirement);
};

const createOutputGroup = (
  selects: SelectRequirement[],
): { [key: string]: SelectRequirement[] } => {
  const outputGroup: { [key: string]: SelectRequirement[] } = {
    "0": [],
    "1": [],
    "2": [],
    "3": [],
  } as const;

  for (const select of selects) {
    if (Object.keys(outputGroup).includes(select.group.toString())) {
      outputGroup[select.group.toString()].push(select);
    }
  }

  return outputGroup;
};

const CompulsoryRequirement = ({ requirement }: CompulsoryProps) => {
  const compulsorySumUnit = requirement.courses.compulsorySumUnit;
  const compulsoryCourses: string[] = requirement.courses.compulsory.map(
    (name: string) => {
      if (name.includes("::")) {
        return `${name.replace("::", " ")}単位`;
      }
      return name.replace("//", " 互換: ");
    },
  );
  return (
    <div className={styles.block}>
      <h2>必修科目</h2>
      {compulsoryCourses.map((courseName: string) => (
        <div>{courseName}</div>
      ))}
      <p className={styles.bold}>合計{compulsorySumUnit}単位</p>
    </div>
  );
};

const SelectElement = ({
  select,
  kdbData,
  compulsoryList,
}: SelectElementProps) => {
  if (isDetailAvailableSelect(select)) {
    const availableCourses = searchCourseFromKdb(
      select.codes,
      kdbData,
      compulsoryList,
    );
    const academicYear = getAcademicYear();
    return (
      <div>
        <details>
          <summary>
            {select.codes.join(", ")}({select.minimum}～{select.maximum})
          </summary>
          {availableCourses.map((course: KdbCourse) => {
            const url = `https://kdb.tsukuba.ac.jp/syllabi/${academicYear}/${course.id}/jpn`;
            return (
              <p>
                <a className={styles.syllabusLink} href={url} target="_blank" rel="noreferrer noopener">
                  {course.id} {course.name} {course.modules} {course.period}{" "}
                  {course.credits}単位 {course.registerYear}年次
                </a>
              </p>
            );
          })}
        </details>
      </div>
    );
  }
  return (
    <p>
      {select.message} {select.minimum}～{select.maximum}
    </p>
  );
};

const SelectGroup = ({
  groupName,
  minimum,
  maximum,
  selects,
  kdbData,
  requirements,
}: SelectGroupProps) => {
  const compulsoryList = requirements.courses.compulsory;
  return (
    <div>
      <h3>{groupName}</h3>
      {selects.map((select: SelectRequirement) => {
        return (
          <SelectElement
            select={select}
            kdbData={kdbData}
            compulsoryList={compulsoryList}
          />
        );
      })}
      <h4>
        合計 ({minimum}～{maximum})
      </h4>
    </div>
  );
};

const SelectSection = ({ requirement, kdbData }: SelectProps) => {
  const tmpSelects: any = requirement.courses.select;
  const selects: SelectRequirement[] = tmpSelects.map((select: any) => {
    return {
      codes: select[0],
      minimum: select[1],
      maximum: select[2],
      isExcludeRequirement: select[3],
      message: select[4],
      group: select[5],
    } as const;
  });
  const groups: Group[] = requirement.courses.groups;
  const courseGroupOutputList = [
    "専門科目",
    "専門基礎科目",
    "共通科目",
    "関連科目",
  ];
  const outputGroup = createOutputGroup(selects);
  return (
    <div className={styles.select}>
      <h2>選択科目</h2>
      {courseGroupOutputList.map((groupName: string, index: number) => {
        const group = groups[index];
        const minimum = group[1];
        const maximum = group[2];
        return (
          <SelectGroup
            groupName={groupName}
            minimum={minimum}
            maximum={maximum}
            selects={outputGroup[index.toString()]}
            kdbData={kdbData}
            requirements={requirement}
          />
        );
      })}
    </div>
  );
};

export const Requirement = ({ major }: RequirementProps) => {
  const [kdbData, setKdbData] = useState<KdbCourse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getKdBData();
      setKdbData(data);
    };
    fetchData();
  }, []);

  const gradRequirements = requirements;
  const requirement = gradRequirements[major];
  const department = requirement.header.department;
  return (
    <div>
      <div className={styles.title}>{department} {major} の卒業要件</div>
      <CompulsoryRequirement requirement={requirement} />
      <SelectSection requirement={requirement} kdbData={kdbData} />
    </div>
  );
};
