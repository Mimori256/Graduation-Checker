# Graduation Checker

<https://mimori256.github.io/Graduation-Checker/>

## 概要

TWINS の成績データから、筑波大学の卒業要件を満たしているかどうか確認するツール。現在は情報学群メディア創成学類と、知識情報・図書館学類の令和 3～7 年度入学生の卒業要件のみに対応しています。

## 開発環境

Node.js 26 系と、`package.json` の `packageManager` に指定した pnpm 12 系を使用します。
pnpm の導入方法は[公式ドキュメント](https://pnpm.io/installation)を参照してください。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

TypeScript 7 系を使用します。型チェック、テスト、ビルドは次のコマンドで実行できます。

```sh
pnpm typecheck
pnpm test --run
pnpm build
```

Biome による lint とフォーマットは次のコマンドで実行できます。

```sh
pnpm lint
pnpm format
```

`pnpm install` 時に Husky の Git フックが設定されます。コミット前に、ステージ済みのファイルに対して lint の自動修正とフォーマットを実行し、修正結果をコミットに含めます。修正できない lint エラーがある場合、コミットは中止されます。

## 卒業要件の追加・更新

新しい入学年度・学類・専攻の卒業要件を登録する手順とデータの記入例は、[卒業要件の追加マニュアル](docs/graduation-requirements.md)を参照してください。

### Contribution

Issue や PR、このツールに関する質問はいつでも受け付けています。
