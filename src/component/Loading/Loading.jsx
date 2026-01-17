
import './Loading.css'

export default function Loading({cards}) {
   switch (cards) {
    case "details":
      return (
        <>
        
    <div className="py-5">
      <div className="skeleton-loader   rounded-2xl bg-white">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-image"></div>
    </div>
      </div>
        </>
      )
     
      case "Posts":
        return(

          <>
          
    <div className="py-5">
      <div className="skeleton-loader   rounded-2xl bg-white">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-image"></div>
    </div>
      </div>
    <div className="py-5">
      <div className="skeleton-loader   rounded-2xl bg-white">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-image"></div>
    </div>
      </div>
    <div className="py-5">
      <div className="skeleton-loader   rounded-2xl bg-white">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-image"></div>
    </div>
      </div>
    <div className="py-5">
      <div className="skeleton-loader   rounded-2xl bg-white">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-image"></div>
    </div>
      </div>
    <div className="py-5">
      <div className="skeleton-loader   rounded-2xl bg-white">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-image"></div>
    </div>
      </div>
          </>
        )
    
   }
}
