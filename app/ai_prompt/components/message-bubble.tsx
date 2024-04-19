import Image from "next/image";
import hmm_cat from "../assets/HmmCat.jpg"
import bao_it from "../assets/bao-it.jpg"

export const MessageBubble = ({ content = 'hello', isUserMessage = false }) => {

  return (
    <div
      className={` break-all overflow-hidden flex flex-col `}
      style={{
        alignItems: isUserMessage ? 'flex-end' : 'flex-start',
      }
      }
    >
      <div className={`flex text-white items-center gap-2 ${isUserMessage ? 'mr-4' : 'ml-4'}`}>
        <Image src={isUserMessage ? hmm_cat : bao_it} alt={'avatar'} className="w-8 rounded-full" />
        <div className="font-semibold">{isUserMessage ? 'Mudoker' : 'GenieX'}</div>
      </div>

      <div
        className={`mx-4 my-4 p-3 rounded-lg text-white bg-gray-600/50`}
        style={{ alignSelf: isUserMessage ? 'flex-end' : 'flex-start' }}
      >
        {content}
      </div>
    </div>
  );
};
