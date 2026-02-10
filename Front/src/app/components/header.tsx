import EditableText from "../utils/Editable";

export default function Header({data}:any) {
  console.log("header",data)
  return (
    <div className="flex  justify-between items-center">
      <div>
        <EditableText
          name="personal_info"
          section="name"
          initialValue={data.full_name||"Your Name"}
          className="text-4xl font-extrabold text-gray-800 block"
          maxLength={20}
        />
        <div className="flex items-center gap-x-5">
          <EditableText
          name="personal_info"
            section="job"
            initialValue="Job Title"
            className="text-blue-400 font-medium text-lg"
            maxLength={20}
          />
          <div>
            <EditableText
            name="personal_info"
              section="email"
              initialValue={data.email||"Email"}
              className="text-blue-400  text-sm"
              maxLength={30}
            />
            <EditableText
            name="personal_info"
              section="phone"
              initialValue="Phone Number"
              className="text-blue-400 text-sm"
              maxLength={13}
            />
          </div>
        </div>
      </div>
      <div>
        <img className="size-18" src="/profile.png" alt="Resume Avatar" />
      </div>
    </div>
  );
}
