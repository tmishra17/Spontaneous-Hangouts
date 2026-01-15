import Image from 'next/image'
import icon from './icon.svg'

export default function Header() {

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Image src={icon} alt="Heart logo" className='w-24 h-16'/>
                    <h1 className="text-2xl font-bold text-gray-100">Spontaneous</h1>
                </div>
            
            </div>
          </>
        )
}   