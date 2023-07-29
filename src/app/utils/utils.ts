// utils.ts
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
// @ts-expect-error
import dayjsTwitter from 'dayjs-twitter';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(dayjsTwitter);

export function formatPicture(picture: any) {

  if (!picture) {
    return '';
  }
  if (picture.__typename === 'MediaSet') {
    if (picture.original.url.startsWith('ipfs://')) {
      let result = picture.original.url.substring(7, picture.original.url.length)
      return `https://lens.infura-ipfs.io/ipfs/${result}`
    } else if (picture.original.url.startsWith('ar://')) {
      let result = picture.original.url.substring(4, picture.original.url.length)
      return `https://arweave.net/${result}`
    } else {
      return picture.original.url
    }
  } else {
    return picture
  }
}

export function formatNickName(nickname: any) {
  if (!nickname) {
    return "";
  }
  const splitName = nickname.split(".");
  if (splitName.length > 0) {
    return splitName[0];
  } else {
    return "";
  }
}


export function formatTextLenth20(text: any) {
  if (!text) {
    return "";
  }
  let result = text.slice(0, 20);
  if (text.length > 20) {
    result += '...';
  }
  return result;
}

export const getTimeAddedNDay = (day: number) => {
  return dayjs().add(day, 'day').utc().format();
};