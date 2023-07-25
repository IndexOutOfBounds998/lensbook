import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import cors from 'cors';
import { useUpIpfs } from "../../hooks/useUpIpfs";

const corsMiddleware = cors({
  methods: ['POST', 'OPTIONS'],
});

const uploadMiddleware = multer({ dest: 'uploads/' });

const { execute, loading: ipfsLoading, url } = useUpIpfs({ type: 'upLoadImg' });

const uploadApi = (req: NextApiRequest, res: NextApiResponse) => {
  uploadMiddleware.single('file')(req, res, async (err: any) => {
    if (err) {
      return res.status(500).json({ error: '文件上传失败：' + err.message });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: '未找到上传的文件' });
    }

    try {
      // 替换为你要上传文件的第三方服务的 API 地址

      const formData = new FormData();
      formData.append('file', file);
      const url = await execute(formData);
      if (url) {
        const ipfsUrl = `https://ipfs.io/ipfs/${url}`;
        return res.status(200).json({ message: '文件上传成功。', data: ipfsUrl });
      }

    } catch (error) {
      console.error('文件上传失败：', error.message);
      return res.status(500).json({ error: '文件上传失败。' });
    }
  });
};

export default corsMiddleware(uploadApi);
