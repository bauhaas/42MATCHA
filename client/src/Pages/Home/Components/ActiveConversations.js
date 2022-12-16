import {useState, useEffect} from 'react';
import { HiOutlineXMark} from 'react-icons/hi2';

function ActiveConversations() {

    const [activeConversations, setActiveConversations] = useState([]);

    //random test data
    useEffect(() => {
      setActiveConversations(
        [
          "https://randomuser.me/api/portraits/women/70.jpg",
          "https://randomuser.me/api/portraits/women/81.jpg",
          "https://randomuser.me/api/portraits/men/81.jpg",
          "https://randomuser.me/api/portraits/men/70.jpg"
        ]
      );
  }, [])

    const remove = (el) => {
        console.log(el);
        const element = document.getElementById(el);
        element.remove();
      };

    return(
        <>
        <div className='fixed bottom-0 right-0 invisible sm:visible border-red-400 border-2'>
              <ul className="flex flex-col gap-2 items-end">
                  {activeConversations.map(user => (
                  <li key={user} id={user} className="flex">
                      <div className="relative w-10 h-10  group">
                        <img className="rounded-full" src={user} alt="user" />
                        <button onClick={() => remove(user)} className=" text-neutral-400 hover:text-neutral-700 invisible group-hover:visible hover:bg-gray-500 h-3 w-3 absolute top-0 right-0 rounded-full bg-gray-700">
                            {/* <HiOutlineXMark className='h-3 w-3'/> */}
                        </button>
                        <div className="absolute bottom-0 left-0 h-3 w-3 border-2 border-gray-500 rounded-full bg-green-400 z-2"></div>
                      </div>
                  </li>
                  ))}
              </ul>
            </div>
        </>
    );
}

export default ActiveConversations;