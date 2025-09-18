import React, { useState, type KeyboardEvent, type ChangeEvent } from 'react';

interface TagsInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      setTags([...tags, inputValue.trim().replace(/\s/g, '')]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-4 bg-[#121214] border border-gray-600 rounded-md">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 text-sm bg-gray-800 text-gray-200 rounded-full"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-gray-400 hover:text-gray-200 focus:outline-none"
              onClick={() => removeTag(index)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter passing keys"
          className="flex-1 min-w-[100px] bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TagsInput;