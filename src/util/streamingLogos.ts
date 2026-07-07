import netflix from "../assets/streaming/netflix.png";
import crunchyroll from "../assets/streaming/crunchyroll.png";
import prime from "../assets/streaming/prime.png";
import hulu from "../assets/streaming/hulu.png";
import disney from "../assets/streaming/disney.jpg";
import bilibili from "../assets/streaming/bilibili.png";
import hidive from "../assets/streaming/hidive.png";
import youtube from "../assets/streaming/youtube.png";
import appleTv from "../assets/streaming/apple-tv.jpg";
import googleTv from "../assets/streaming/google-tv.png";
import mubi from "../assets/streaming/mubi.png";
import retroCrush from "../assets/streaming/RetroCrush.png";
import tubi from "../assets/streaming/tubi.webp";
import viki from "../assets/streaming/viki.png";
import iqiyi from "../assets/streaming/iqiyi.jpg";
import aniplus from "../assets/streaming/aniplus.png";
import bahamut from "../assets/streaming/bahamut.png";
import catchplay from "../assets/streaming/catchplay.png";
import mewatch from "../assets/streaming/me-watch.jpg";

const logoMap: Record<string, string> = {
  "Aniplus TV": aniplus,
  "Bahamut Anime Crazy": bahamut,
  "Me Watch": mewatch,
  MeWatch: mewatch,
  Catchplay: catchplay,
  "CatchPlay+": catchplay,
  Netflix: netflix,
  Crunchyroll: crunchyroll,
  "Amazon Prime Video": prime,
  Hulu: hulu,
  "Disney Plus": disney,
  Disney: disney,
  Bilibili: bilibili,
  "Bilibili Global": bilibili,
  HIDIVE: hidive,
  YouTube: youtube,
  "Amazon Video": prime,
  "Apple TV": appleTv,
  "Google TV": googleTv,
  MUBI: mubi,
  "Muse Asia": youtube,
  RetroCrush: retroCrush,
  Tubi: tubi,
  Viki: viki,
  "Ani-One Asia": youtube,
  iQIYI: iqiyi,
};

const normalizeServiceName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/\s+/g, "");
};

export const getStreamingLogoUrl = (name: string) => {
  const normalizedName = normalizeServiceName(name);

  const directMatch = logoMap[name.trim()];
  if (directMatch) {
    return directMatch;
  }

  return (
    Object.entries(logoMap).find(([serviceName]) => {
      return normalizeServiceName(serviceName) === normalizedName;
    })?.[1] ?? null
  );
};
