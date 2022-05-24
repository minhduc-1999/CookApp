import axios from "axios";
import { ImageType } from "react-images-uploading";
import { baseUrl, token } from "./token";
import { storage } from "./firebase";
import { ref, uploadBytes } from "firebase/storage";
import { networkChecking } from "utils/network";

type SignedLinkResponseItem = {
  signedLink: string;
  objectName: string;
};

export const uploadImageToStorage = async (data: ImageType | undefined) => {
  await networkChecking()
  if (!data || !data.file) throw new Error("No image found");
  try {
  const signedLinkItem: SignedLinkResponseItem = await axios
    .post(
      baseUrl + "/storage/uploadSignedUrl",
      {
        fileNames: [data.file?.name],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      if (response.status === 201) return response.data.data.items[0];
      throw new Error("Error");
    });
  const newImageRef = ref(storage, signedLinkItem.objectName);
  await uploadBytes(newImageRef, data.file).catch(err => console.log(err))
  return signedLinkItem.objectName;
  }
  catch {
    throw new Error("Failed to upload image")
  }
};
