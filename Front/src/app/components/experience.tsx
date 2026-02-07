import EditableText from "../utils/Editable"
export default function Experience(){
    return(

       <div>
  {/* تیتر بخش */}
  <h2 className="font-bold text-blue-700 text-xl mb-2 uppercase tracking-wider">
    Experience
  </h2>

  <div className="space-y-4">
    {/* یک نمونه سابقه کاری */}
    <div className="relative group">
      
      {/* ردیف اول: نام شرکت و مدت زمان */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <EditableText
            name="company_name"
            initialValue="Company Name"
            placeholder="Enter Company Name..."
            className="text-lg font-bold text-gray-800 block"
            maxLength={50}
          />
        </div>
        
        <div className="text-right">
          <EditableText
            name="duration"
            initialValue="Jan 2022 - Present"
            placeholder="Duration (e.g. 2 years)"
            className="text-sm text-gray-500 font-medium"
            maxLength={30}
          />
        </div>
      </div>

      {/* ردیف دوم: توضیحات فعالیت‌ها */}
      <div className="mt-2 text-gray-600 leading-relaxed">
        <EditableText
          name="job_description"
          initialValue="What did you do there? (Responsibilities and achievements)"
          placeholder="Describe your role and impact..."
          className="text-sm block w-full"
          maxLength={1000}
        />
      </div>

    </div>
  </div>
</div>
         
    )
}