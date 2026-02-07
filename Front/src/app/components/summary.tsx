import EditableText from "../utils/Editable"
export default function Summary(){
    return(

        <div className="">
            <h2 className="font-bold text-blue-700 text-xl mb-2 uppercase tracking-wider">Summary</h2>
            <div>
        <EditableText
            name="summary"
          initialValue="some things about yourself"
          className="block"
        />
        </div>
        </div>
         
    )
}