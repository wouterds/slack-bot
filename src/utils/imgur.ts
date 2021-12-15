import FormData from 'form-data';
import fetch from 'node-fetch';

export const uploadImageFromUrl = async (
  url: string,
): Promise<string | null> => {
  try {
    const body = new FormData();
    body.append('type', 'url');
    body.append('image', url);

    const uploadResponse = await fetch('https://api.imgur.com/3/upload', {
      method: 'post',
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      },
      body,
    });

    const { data } = await uploadResponse.json();

    return data.link || null;
  } catch {
    return null;
  }
};
