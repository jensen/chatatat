interface IMessageListProps {
  messages: {
    id: string;
    name: string;
    content: string;
  }[];
}

const extractImages = (value: string) => {
  const images = value.match(/https?:\/\/.*\.(?:png|jpe?g)/gi);

  if (images) {
    const text = images.reduce(
      (full, current) => full.replace(current, ""),
      value
    );

    return {
      text,
      images,
    };
  }

  return {
    text: value,
  };
};

export default function MessageList(props: IMessageListProps) {
  return (
    <div className="flex-1 flex flex-col-reverse p-2 relative overflow-y-auto">
      <ul className="w-full px-2 flex flex-col justify-end">
        {props.messages.map((message) => {
          const { text, images } = extractImages(message.content);
          return (
            <li key={message.id} className="text-sm">
              <span className="font-bold text-gray-300">{message.name}</span>
              <span className="font-light text-gray-400 ml-2">{text}</span>
              {images?.map((image) => (
                <img src={image} key={image} className="max-w-lg py-2" />
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
