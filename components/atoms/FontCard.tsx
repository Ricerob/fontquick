import React from 'react';

type FontCardProps = {
  author: string,
  downloads: number,
  img: string,
  name: string,
  license: string,
}

const FontCard = ({ author, downloads, img, name, license }: FontCardProps) => {
  return (
    <div className="flex flex-col items-center p-4 mx-2">
      <img src={img} alt={name} className="h-80 w-auto object-cover rounded-sm border-2 border-indigo-500 mb-4" />
      <div className="text-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{author}</p>
        <p className="text-gray-300">{downloads} downloads</p>
        <p className="text-gray-300">{license}</p>
      </div>
    </div>
  );
}

export default FontCard;
