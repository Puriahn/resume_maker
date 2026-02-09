import EditableText from "../utils/Editable"
export default function Education(){
    return(

         <div>
         {/* تیتر بخش */}
         <h2 className="font-bold text-blue-700 text-xl mb-2 uppercase tracking-wider">
           Education
         </h2>
       
         <div className="space-y-4">
           {/* یک نمونه سابقه کاری */}
           <div className="relative group">
             
             {/* ردیف اول: نام شرکت و مدت زمان */}
             <div className="flex gap-x-3 items-center">
               <div className="">
                 <EditableText
                   name="educations"
                  section="institute_name"
                   initialValue="Institute Name"
                   placeholder="Enter Institute Name..."
                   className="text-lg font-bold text-gray-800 block"
                   maxLength={50}
                 />
               </div>
               
               <div className="">
                 <EditableText
                   name="educations"
                   section="duration-ed"
                   initialValue="Jan 2022 - Present"
                   placeholder="Duration (e.g. 2 years)"
                   className="text-sm text-gray-500 font-medium"
                   maxLength={30}
                 />
               </div>
             </div>
       
       
           </div>
         </div>
       </div>
         
    )
}