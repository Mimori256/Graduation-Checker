const codeType = {
  総合科目: {
    codes: ["1", "2", "3", "4", "5", "6"],
    except: [],
  },
  フレッシュマンセミナー: {
    codes: ["11"],
    except: [],
  },
  学問への誘い: {
    codes: ["1227", "1228"],
    except: [],
  },
  学士基盤科目: {
    codes: ["12", "14"],
    except: ["1227", "1228"],
  },
  体育: {
    codes: ["2"],
    except: [],
  },
  外国語: {
    codes: ["3"],
    except: [],
  },
  英語: {
    codes: ["31"],
    except: ["3190012", "3190022"],
  },
  情報: {
    codes: ["6"],
    except: [],
  },
  国語: {
    codes: ["5"],
    except: [],
  },
  芸術: {
    codes: ["4"],
    except: [],
  },
  自由科目特設: {
    codes: ["8"],
    except: ["8049911", "8049921", "8149911"],
  },
  教職に関する科目: {
    codes: ["9"],
    except: ["99"],
  },
  博物館に関する科目: {
    codes: ["99"],
    except: [],
  },
  必修英語: {
    codes: ["31H", "31J", "31K", "31L"],
    except: [],
  },
  知識情報演習: {
    codes: ["GE110", "GE111", "GE112"],
    except: [],
  },
};

export default codeType;
