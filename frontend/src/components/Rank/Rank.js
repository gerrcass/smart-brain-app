import React from 'react';

const Rank = ({ name, entries, rankEmoji }) => {

  return (
    <div>
      <div className="white f3">
        {name}, your current entry count is...
      </div>
      <div className="white f1">{entries}</div>
      <div className="white f3">Rank Badge: {rankEmoji}</div>
    </div>
  );

}
export default Rank;