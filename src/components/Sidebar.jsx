import React, { useState } from 'react';
import Searchbox from './Searchbox';
import Conversationlist from './Conversationlist';

export default function Sidebar({
  conversations,
  currentConvid,
  showSidebar,
  onLoadConversations,
  onDeleteConversations,
  onCreatenew,
  onTogglesidebar,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchConversations = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResult([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const results = [];
    conversations.forEach(conv => {
      conv.messages.forEach((msg, idx) => {
        if (msg.text.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            convId: conv.id,
            convTitle: conv.title,
            messageIdx: idx,
            message: msg,
            context: msg.text.substring(0, 100),
          });
        }
      });
    });
    setSearchResult(results);
  };

  const handleSearchResult = (convId) => {
    onLoadConversations(convId);
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
      <div className="sidebar-header">
        {showSidebar && <h2>Chats</h2>}
        <button className="menu-btn" onClick={onTogglesidebar}>
          {showSidebar ? '✕' : '☰'}
        </button>
      </div>

      <Searchbox
        searchQuery={searchQuery}
        onsearchChange={searchConversations}
      />

      {isSearching && searchResult.length > 0 && (
        <div className="search-results">
          <div className="results-title">{searchResult.length} results found</div>
          {searchResult.map((result, idx) => (
            <div
              key={idx}
              className="search-result-item"
              onClick={() => handleSearchResult(result.convId)}
            >
              <div className="result-conv-title">{result.convTitle}</div>
              <div className="result-preview">{result.context}..</div>
              <div className={`result-role ${result.message.role}`}>
                {result.message.role === 'user' ? ' You ' : ' Bot '}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && (
        <>
          <button className="new-chat-btn" onClick={onCreatenew}>✙ New Chat</button>
          <Conversationlist
            conversations={conversations}
            currentConvid={currentConvid}
            onLoadConversations={onLoadConversations}
            onDeleteConversations={onDeleteConversations}
          />
        </>
      )}
    </div>
  );
}