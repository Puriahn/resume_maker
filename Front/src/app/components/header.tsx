import { useResumeStore } from "../store/store";
import EditableText from "../utils/Editable";
import ProfileImage from './Image';

export default function Header({data}:any) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <EditableText
        
          name="personal_info"
          section="name"
          initialValue={data.personal_info.name||"Your Name"}
          className="text-xl md:text-3xl font-extrabold text-[#1f2937] block"
          maxLength={20}
        />
        <div className="block md:flex items-center gap-x-5">
          <EditableText
          name="personal_info"
            section="job"
            initialValue={data.personal_info.job||"Job Title"}
            className="text-blue-400 font-medium text-xs md:text-sm"
            maxLength={20}
          />
          <div>
            <div
            className="text-blue-400 font-medium text-xs md:text-sm pl-1"
            >{data.personal_info.email}</div>
            <EditableText
            name="personal_info"
              section="phone"
              initialValue={data.personal_info.phone||"Phone Number"}
              className="text-blue-400 text-xs md:text-sm"
              maxLength={13}
            />
          </div>
        </div>
      </div>
      <ProfileImage data={data}/>
    </div>
  );
}
