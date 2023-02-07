

// 指定范围整数随机生成器 by Lingrottin
export function genRandom(maxNumber: number, minNumber?: number): number {
    if (minNumber) {
      return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    }
    else {
      return Math.floor(Math.random() * (maxNumber + 1));
    }   
  }
  
  


// 排序比较函数
export var by = function (name) {
    return function (o, p) {
      var a, b;
      if (typeof o === "object" && typeof p === "object" && o && p) {
        a = o[name];
        b = p[name];
        if (a === b) {
          return 0;
        }
        if (typeof a === typeof b) {
          return a > b ? -1 : 1;
        }
        return typeof a > typeof b ? -1 : 1;
      }
      else {
        throw ("error");
      }
    }
  }
  
  