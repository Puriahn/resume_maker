import EditableText from "../utils/Editable"
export default function Education({data}:any){
    return(

         <div>
         <h2 className="font-bold text-blue-700 text-lg md:text-xl mb-2 uppercase tracking-wider">
           Education
         </h2>
       
         <div className="space-y-4">
           <div className="relative group">
             
             <div className="flex gap-x-3 items-center">
               <div className="">
                 <EditableText
                   name="educations"
                  section="institute_name"
                   initialValue={data.educations[0]?.institute_name||"Institute Name"}
                   placeholder="Enter Institute Name..."
                   className="md:text-lg text-sm font-bold text-gray-800 block"
                   maxLength={50}
                 />
               </div>
               
               <div className="">
                 <EditableText
                   name="educations"
                   section="date"
                   initialValue={data.educations[0]?.date||"Jan 2022 - Present"}
                   placeholder="Duration (e.g. 2 years)"
                   className="md:text-sm text-xs text-gray-500 font-medium"
                   maxLength={30}
                 />
               </div>
             </div>
       
       
           </div>
         </div>
       </div>
         
    )
}