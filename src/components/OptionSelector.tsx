import { majorNames, majors, years } from "../consts/const";
import styles from "../styles/OptionSelector.module.css";

interface OptionSelectorProps {
  readonly onMajorChange: (major: string) => void;
  readonly onYearChange: (year: string) => void;
}

export const OptionSelector = ({
  onMajorChange,
  onYearChange,
}: OptionSelectorProps) => {
  const handleMajorChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    onMajorChange(target.value);
  };

  const handleYearChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    onYearChange(target.value);
  };

  return (
    <div className={styles.selector}>
      <p>
        <b>チェックする学類と専攻・年度</b>
      </p>
      <div>
        <label htmlFor="major">学類-専攻</label>
        <select name="major" id="major" onChange={handleMajorChange}>
          {majorNames.map((name, index) => (
            <option key={majors[index]} value={majors[index]}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="year">年度</label>
        <select name="year" id="year" onChange={handleYearChange}>
          {years.map((year, index) => (
            <option key={majors[index]} value={year}>
              {year}年度
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
