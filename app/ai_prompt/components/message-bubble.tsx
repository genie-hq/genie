import { useState } from 'react';

export const MessageBubble = ({ content = 'hello', isUserMessage = false }) => {
  const bgColor = isUserMessage ? 'bg-blue-500' : 'bg-gray-500';
  const [isRightClicked, setRightClicked] = useState(false);
  const [isDeleted, setIsDeleteMessage] = useState(false);

  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });

  if (isDeleted) {
    return;
  }

  return (
    <span
      style={
        {
          maxWidth: '300px',
          wordBreak: 'break-all',
          overflow: 'hidden',
          display: 'inline-block', alignSelf: !isUserMessage ? 'flex-start' : 'flex-end',
        }
      }
      className={`mx-4 my-4 p-3 rounded-lg ${bgColor} text-white`}
      onContextMenu={(e) => {
        e.preventDefault();
        setRightClicked(true);
        setPoints({
          x: (e.screenX + 200) >= window.innerWidth ? window.innerWidth - 150 : e.pageX,
          y: (e.screenY + 200) >= window.innerHeight ? window.innerHeight - 200 : e.pageY,
        });
      }}
    >
      {content}
      {isRightClicked && (
        <div className="position-relative">
          <div
            className="absolute w-200 bg-gray-800 rounded-lg box-border"
            style={{ top: `${points.y}px`, left: `${points.x}px` }}
            onMouseLeave={() => setRightClicked(false)}>
            <ul className="p-2 m-0 list-none">
              <li className="p-3 hover:bg-black cursor-pointer">Forward</li>
              <li
                className="p-3 hover:bg-black cursor-pointer"
                onClick={() => setIsDeleteMessage(true)}
              >Delete</li>
              <li className="p-3 hover:bg-black cursor-pointer">Pin</li>
            </ul>
          </div>
        </div>
      )}
    </span>
  );
};
