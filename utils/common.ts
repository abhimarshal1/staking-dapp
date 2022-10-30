import { FetchBalanceResult } from "@wagmi/core";
import { formatEther } from "ethers/lib/utils";

export const toFixedWithoutRounding = (value: string, decimals: number) =>
  (value.match(new RegExp(`^-?\\d+(?:.\\d{0,${decimals}})?`)) as string[])[0];

export const toStringPrecision = (num: number) => {
  let res = "";

  if (Math.abs(num) < 1.0) {
    const e = parseInt(num.toString().split("e-")[1]);
    if (e) {
      num *= Math.pow(10, e - 1);
      res = "0." + new Array(e).join("0") + num.toString().substring(2);
    }
  } else {
    let e = parseInt(num.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      num /= Math.pow(10, e);
      res = num + new Array(e + 1).join("0");
    }
  }

  res = res.includes(".") ? Number(res).toFixed(8) : res;

  return res || num.toString();
};

export const formatBalance = (data: FetchBalanceResult | undefined) => {
  if (!data) {
    return "0";
  }

  const value = +toFixedWithoutRounding(data.formatted, 4);

  return value;
};

export const formatStakedAmount = (data: any) => {
  if (!data) {
    return "0";
  }

  const etherValue = formatEther(data.toString());
  const value = +toFixedWithoutRounding(etherValue, 4);

  return value;
};
