//
// Types
//
export type value = "〈〉";
export type type = () => value | type;

interface IProduct {
  (): string;
  a: type | undefined;
  b: type | undefined;
}
export function product(a: type, b: type) {
  const r = function() {
    return `(${a()},${b()})`;
  };
  r.a = a;
  r.b = b;
  return r;
}

interface ISum {
  (): string;
  a: type | undefined;
  b: type | undefined;
}
export function sum(a: type | undefined, b: type | undefined): ISum {
  if (a === undefined && b === undefined) {
    throw new Error("Both args cannot be undefined");
  } else if (a !== undefined && b !== undefined) {
    throw new Error("Both args cannot be defined");
  }

  const r = function() {
    if (a) {
      return `(σL${a()})`;
    } else {
      return `(σR${b!()})`;
    }
    // return `(${a?.() ?? " "},${b?.() ?? " "})`;
  };
  r.a = a;
  r.b = b;
  return r;
}

//
// Combinators
//
export function unit(): type {
  return () => "〈〉";
}

export function iden(a: type) {
  return a;
}

export function comp(fn1: any) {
  return function (fn2: any) {
    return function (x: any) {
      return fn2(fn1(x));
    };
  };
}

export function injl(fn: any) {
  return function(x: any) {
    return sum(fn(x), undefined);
  }
}

export function injr(fn: any) {
  return function(x: any) {
    return sum(undefined, fn(x));
  }
}

export function caseCombinator(firstBranch: any) {
  return function (secondBranch: any) {
    return function (subject: ISum | IProduct) {
      const s = (subject.a as ISum | IProduct);
      if (s.a !== undefined) {
        return firstBranch(product(s.a, subject.b!));
      } else {
        return secondBranch(product(s.b!, subject.b!));
      }
    }
  }
}

export function pair(s: any) {
  return function (t: any) {
    return function (a: any) {
      return product(s(a), t(a));
    }
  }
}

export function take(t: any) {
  return function (a: IProduct) {
    return t(a.a);
  }
}

export function drop(t: any) {
  return function (a: IProduct) {
    return t(a.b);
  }
}

console.log(
  "iden unit\n",
  iden(unit())()
)

console.log(
  "pair iden iden unit\n",
  pair(iden)(iden)(unit())()
)

console.log(
  "pair iden iden (pair iden iden unit)\n",
  pair(iden)(iden)(pair(iden)(iden)(unit()))()
);

console.log(
  "pair iden iden unit\n",
 pair(iden)(iden)(unit())()
);

console.log(
  "pair iden unit (injl iden unit)\n",
  pair(iden)(unit)(injl(iden)(unit()))()
)

console.log(
  "pair iden unit (injr iden unit)\n",
  pair(iden)(unit)(injr(iden)(unit()))()
)

console.log(
  "take (pair iden iden unit)\n",
  take(iden)(pair(iden)(iden)(unit()))()
)

console.log(
  "take (pair iden iden (injl iden unit))\n",
  take(iden)(pair(iden)(iden)(injl(iden)(unit())))()
)
