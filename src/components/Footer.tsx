import styles from "../styles/Footer.module.css";

const Contributors = () => (
  <footer className={styles.contributor}>
    Contributed by{" "}
    <address className={`contributor ${styles.contributor}`}>
      <a
        href="https:///github.com/Mimori256"
        target="_blank"
        rel="noreferrer noopener"
      >
        Mimori
      </a>
    </address>
    ,&thinsp;
    <address className={`contributor ${styles.contributor}`}>
      <a
        href="https://github.com/yudukikun5120"
        target="_blank"
        rel="noreferrer noopener"
      >
        yudukikun5120
      </a>
    </address>
  </footer>
);

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <ul>
        <li>
          TWINSの成績ファイルはローカルで処理され、サーバにアップロードされることはありません
        </li>
        <li>
          現在は2021、2022、2023年度入学の情報学群メディア創成学類、知識情報図書館学類の卒業要件のみに対応しています
        </li>
        <li>
          卒業要件は、
          <a
            href="https://www.tsukuba.ac.jp/education/ug-courses-directory/index.html"
            target="_blank"
            rel="noreferrer noopener"
          >
            学群等履修細則
          </a>
          に基づいています
        </li>
        <li>
          このツールの使用によって生じた不利益等について、開発者は一切の責任を負いません
        </li>
      </ul>
      <p>
        <a
          href="https://github.com/Mimori256/Graduation-Checker"
          target="_blank"
          rel="noreferrer noopener"
        >
          Source code is available on GitHub
        </a>
      </p>
      <Contributors />
    </div>
  );
};
