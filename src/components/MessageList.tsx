interface IMessage {
  id: string;
  name: string;
  content: string;
}

interface IMessageListProps {
  messages: IMessage[];
}

export default function MessageList(props: IMessageListProps) {
  return (
    <div className="flex-1 flex flex-col-reverse p-2 relative overflow-y-auto">
      <ul className="w-full px-2 flex flex-col justify-end">
        {props.messages.map((message) => {
          return (
            <li key={message.id} className="text-sm">
              <span className="font-bold text-gray-300">{message.name}</span>
              <span className="font-light text-gray-400 ml-2">
                {message.content}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
