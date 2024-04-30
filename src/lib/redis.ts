import { Redis } from "@upstash/redis";

export const revalidate = 0; // disable cache

export const redis = new Redis({
  url: "https://apn1-tolerant-gull-33989.upstash.io",
  token:
    "AYTFASQgZTZhNWViZWEtYTMwYS00YzZhLWFiZDYtYWIwMDA5NzIzZmU0Yjc1ZWY0NTY0YmUyNDQ3Yjk0MTI4ZmIwZTE0Y2UwNjQ=",
});

