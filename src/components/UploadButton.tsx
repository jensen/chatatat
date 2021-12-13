import { useSupabaseUpload } from "~/context/supabase";

interface IUploadButtonProps {
  onUpload?: (url: string | null) => void;
}

export default function UploadButton(props: IUploadButtonProps) {
  const { upload } = useSupabaseUpload("public_images");

  return (
    <label>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="32px"
        height="32px"
        className="hover:cursor-pointer fill-indigo-300 hover:fill-indigo-800"
      >
        <path d="M34.0507,43H8V33.2617l5.9048-6.8066a3.1212,3.1212,0,0,1,4.7515.0752L23.74,32.7922l9.6294-11.6594a3.1293,3.1293,0,0,1,4.78-.0029l6.9427,8.4045A15.0083,15.0083,0,0,0,34.0507,43ZM24.19,14.5176a4,4,0,0,0,0,8A4,4,0,1,0,24.19,14.5176ZM34.0507,45H7a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H49a1,1,0,0,1,1,1V29.0507a14.875,14.875,0,0,1,4,.8244V10a3.0033,3.0033,0,0,0-3-3H5a3.0033,3.0033,0,0,0-3,3V46a3.0033,3.0033,0,0,0,3,3H34.8751A14.8742,14.8742,0,0,1,34.0507,45ZM49,31A13,13,0,1,0,62,44,13.0147,13.0147,0,0,0,49,31Zm5,13H52v8a1,1,0,0,1-1,1H47a1,1,0,0,1-1-1V43.9756L44.0122,44a1.0021,1.0021,0,0,1-.8262-1.5811l5-7a1.0379,1.0379,0,0,1,1.628,0l5,7A1.007,1.007,0,0,1,54,44Z" />
      </svg>
      <input
        type="file"
        name="upload"
        accept=".jpg, .jpeg, .png"
        className="hidden"
        onChange={(event) => {
          if (event.target.files === null) return;
          if (event.target.files.length > 0 && props.onUpload) {
            upload(event.target.files[0]).then(props.onUpload);
          }
        }}
      />
    </label>
  );
}
