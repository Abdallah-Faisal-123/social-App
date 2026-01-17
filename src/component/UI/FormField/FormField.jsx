
export default function FormField({elementType,className,lableText,type,id,name,placeholder,value,onChange,onBlur,touched,error ,options ,UserExist}) {


  const renderElement =()=>{
    switch(elementType)
    {
      case 'input':
        return <>
        <input  type={type} id={id} 
         className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body" 
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
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body" 
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
       <div className='pt-2'>
        <label htmlFor={id} className="block mb-2.5 text-sm font-medium text-heading">{lableText}</label>
        
         {renderElement()}
    </div>
      {error && touched && (<div className="text-sm text-red-500">*{error}</div> )}
      {UserExist && (<div className="text-sm text-red-500">*{UserExist}</div> )}
    </>
  )
}
