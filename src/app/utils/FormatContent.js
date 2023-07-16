
import { IPFS_GATEWAY } from '../constants/constant';

export function formatContent(item) {
    if (!item.contentResponse) {
        return {};
    }
    const contentItem = JSON.parse(item.contentResponse);
    if (contentItem.image) {
        contentItem.image = contentItem.image.replace("ipfs://", IPFS_GATEWAY);
    }
    return { ...item, ...contentItem };
}


export function formatAvater(imgUrl) {
    if (!imgUrl) {
        return IPFS_GATEWAY + "QmXmQQ2ThRHCMgDZFTfKpYBjLeCRGJNcEHCzWtGV1T41sU?_gl=1*no7k0p*rs_ga*MTYyNTY0OTE5OS4xNjg0MjE2MzQ3*rs_ga_5RMPXG14TE*MTY4NjY2NDk3My4zMC4xLjE2ODY2NjY4NTAuNTUuMC4w";
    }
    if (imgUrl.indexOf("http://") !== -1 || imgUrl.indexOf("https://") !== -1) {
        return imgUrl;
    } else if (imgUrl.startsWith('ipfs://')) {
        let result = imgUrl.substring(7, imgUrl.length)
        return `http://lens.infura-ipfs.io/ipfs/${result}`
    }
}

export function formatPicture(picture) {
    if (picture == undefined || picture == null) {
        return picture;
    }
    if (picture.__typename === 'MediaSet') {
        if (picture.original.url.startsWith('ipfs://')) {
            let result = picture.original.url.substring(7, picture.original.url.length)
            return `http://lens.infura-ipfs.io/ipfs/${result}`
        } else if (picture.original.url.startsWith('ar://')) {
            let result = picture.original.url.substring(4, picture.original.url.length)
            return `http://arweave.net/${result}`
        } else {
            return picture.original.url
        }
    } else {
        return picture
    }
}


export function formatNickName(nickname) {
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

function formatMonthAndDay(date) {
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return month + '-' + day;
}

export function formatDate(dateString) {
    if (dateString === undefined || dateString === '') {
        return '';
    }
    var currentDate = new Date();
    var inputDate = new Date(dateString);

    if (inputDate.getFullYear() !== currentDate.getFullYear()) {
        return inputDate.getFullYear() + '-' + formatMonthAndDay(inputDate);
    } else {
        return formatMonthAndDay(inputDate);
    }
}






