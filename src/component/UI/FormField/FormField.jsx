
export default function FormField({elementType,className,lableText,type,id,name,placeholder,value,onChange,onBlur,touched,error ,options ,UserExist}) {

  const baseInputClass = "bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 block w-full px-3.5 py-2.5 shadow-sm placeholder:text-slate-400 transition-all duration-200 outline-none"

  const renderElement =()=>{
    switch(elementType)
    {
      case 'input':
        return <>
        <input  type={type} id={id} 
        className={baseInputClass}
         placeholder={placeholder}
          required
          name={name}
          value={value} 
          onChange={onChange}
          onBlur={onBlur}
          />
        </>;
        case 'select':
          return<>
          <select   required
          className={baseInputClass}
          id={id} 
          name={name}
          value={value} 
          onChange={onChange}
          onBlur={onBlur}>
            {options.map((option,index)=><option key={index} value={option.value} >{option.text}</option>)}
          </select>
          
          </>

          case'file':
          return <>
          <input type="file" 
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={className}
          />
          
          </>
          case 'texterea':
            return<>
            <textarea
             name={name}
              id={id}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={className}
              placeholder={placeholder}
              ></textarea>
            </>

    }
  }

  return (
    <>
       <div className='pt-3'>
        <label htmlFor={id} className="block mb-1.5 text-sm font-semibold text-slate-700">{lableText}</label>
        
         {renderElement()}
    </div>
      {error && touched && (<div className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1"><span>⚠</span> {error}</div> )}
      {UserExist && (<div className="text-xs text-rose-500 mt-1.5 font-medium flex items-center gap-1"><span>⚠</span> {UserExist}</div> )}
    </>
  )
}
