import { NextResponse } from "next/server";
import ipfsApi from "../../api/ipfsApi";
import { IPFS_API_KEY } from "../../constants/constant";
export async function POST(request: Request) {
  const formData = await request.formData();

  // Get file from form data
  const file = formData.get("file");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        Authorization: `Bearer ${IPFS_API_KEY}`,
      },
    };
    const res = await ipfsApi["upLoadImg"](formData, config);

    if (res) {
      return NextResponse.json({
        code: 200,
        message: "success",
        data: res.IpfsHash,
      });
    }
  } catch (error) {
    console.error("文件上传失败：", error.message);
    return NextResponse.json({
      code: 500,
      error: "upload error" + error.message,
    });
  }

  return NextResponse.json({ code: 404, message: "unkonw" });
}
