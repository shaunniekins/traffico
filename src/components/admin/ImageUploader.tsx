import React, { ChangeEvent } from "react";

interface ImageUploaderProps {
  title: string;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  preview: any;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  setImage,
  setPreview,
  preview,
}) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      <div className="flex flex-col p-3 gap-2 border border-sky-700 bg-zinc-100 rounded-lg">
        <label className="text-sky-700">{title}</label>
        <div className="flex flex-col items-center">
          {preview ? (
            <label
              className="w-44 h-44 flex flex-col items-center rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue"
              style={{
                backgroundImage: `url(${preview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          ) : (
            <label className="w-44 h-44 flex flex-col items-center px-4 py-6 bg-gray-200 text-blue rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
              <div className="h-full w-full flex items-center justify-center">
                <img
                  src="/add_photo.svg"
                  alt="Preview"
                  className="rounded-lg h-20 w-20 object-cover"
                />
              </div>

              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>
    </>
  );
};
export default ImageUploader;
