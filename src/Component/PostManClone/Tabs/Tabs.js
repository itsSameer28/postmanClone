import React, { useState } from "react";
import PostMan from "../Postman";

export default function Tabs() {
  const [initialTab, setInitialTabs] = useState([{ id: 1 }]);
  const [presentActiveTab, setPresentActiveTab] = useState(1);
  const [endId, setEndId] = useState(1);

  
  const addTab = () => {
    const newTab = { id: endId + 1 };
    setInitialTabs([...initialTab, newTab]);
    setPresentActiveTab(newTab.id);
    setEndId(newTab.id);
  };
  
  const closeTab = (tabId) => {
    const newTabs = initialTab.filter((tab) => tab.id !== tabId);
    setInitialTabs(newTabs);
    if (presentActiveTab === tabId) {
      setPresentActiveTab(newTabs.length > 0 ? newTabs[0].id : null);
    }
  };

  return (
    <div className="tabs-container">
      <ul>
        {initialTab.map((tab) => (
          <li key={tab.id}>
            <a
              className={`tab-link ${
                tab.id === presentActiveTab ? "tab-link-active" : ""
              }`}
              onClick={() => setPresentActiveTab(tab.id)}
              href>
              Tab {tab.id}
              {tab.id !== 1 && (
                <button className="tab-close" onClick={() => closeTab(tab.id)}>
                  Delete Tab
                </button>
              )}
            </a>
          </li>
        ))}
        <li>
          <button className="tab-add" onClick={addTab}>
            New Tab
          </button>
        </li>
      </ul>
      {initialTab.map((tab, index) => (
        <div
          key={tab.id}
          className={tab.id === presentActiveTab ? "tab-active" : "tab"}
        >
          <PostMan />
        </div>
      ))}
    </div>
  );
}
