import EditableText from "../utils/Editable"
export default function Summary({data}:any){
    return(

        <div className="">
            <h2 className="font-bold text-blue-700 text-lg md:text-xl mb-2 uppercase tracking-wider">Summary</h2>
            <div>
        <EditableText
            name="summary"
            section="description"
          initialValue={data.summary?.description||"some things about yourself"}
          className="block text-sm"
        />
        </div>
        </div>
         
    )
}